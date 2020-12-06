open Common

let log = Devkit.Log.from "storage"

let s = Hashtbl.create 1 (* mem storage for games *)
let v = Hashtbl.create 1 (* mem storage for votes *)
let b = Hashtbl.create 1 (* mem storage for scoreboard *)

let new_game players tournament url =
  let id = Hashtbl.length s in
  let created = Devkit.Time.now () in
  let game = {
    state = VotingOpen;
    id;
    players;
    url;
    tournament;
    created;
    started = None;
    called = None
  } in
  Hashtbl.add s id game;
  id

let vote (id:int) (user:string) (player:int) =
  (* check if game exists and state allows voting *)
  match Hashtbl.find_opt s id with
  | None -> raise (Failure "game not found")
  | Some game when game.state <> VotingOpen -> raise (Failure "not allowed")
  | _ -> ();
  (* check if already voted *)
  match Hashtbl.find_opt v id with
  | None -> Hashtbl.add v id [ user, player ]
  | Some votes ->
    (*TODO replace *)
    if not @@ List.mem_assoc user votes then
      Hashtbl.replace v id ((user, player)::votes); (* silently ignore hehe *)
      ()

let record_start id =
  match Hashtbl.find_opt s id with
  | Some game when game.state = VotingOpen ->
    let new_game = { game with state = VotingClosed; started = Some (Devkit.Time.now ()) } in
    Hashtbl.replace s id new_game
  | _ -> log #error "Failed to record start for game id %d" id

let add_score (user:string) (prize:float) =
  match Hashtbl.find_opt b user with
  | None -> Hashtbl.add b user prize
  | Some score -> Hashtbl.replace b user (score+.prize)

(* helper func *)
let get_pool_prize id player =
  match Hashtbl.find_opt v id with
  | None -> 0.
  | Some votes ->
    let pool = List.length votes in
    (* need firstly to know number of correct votes *)
    let nr_correct = List.fold_left (fun prev (_, vote) -> if vote = player then prev+1 else prev) 0 votes in
    let prize = if nr_correct <> 0 then (float pool) /. (float nr_correct) else 0. in
    prize

let game_winner id =
  match Hashtbl.find_opt s id with
  | None -> None
  | Some game -> begin
     match game.state with
     | Called player -> Some player
     | _ -> None
     end

let update_scoreboard id player =
  (* now pool = number of votes *)
  match Hashtbl.find_opt v id with
  | None -> () (* valid situation, no votes, no updates *)
  | Some votes ->
    let prize = get_pool_prize id player in
    List.iter (fun (user, vote) ->
      let score = Option.default 0. @@ Hashtbl.find_opt b user in
      let prize = if vote = player then prize else 0. in
      Hashtbl.replace b user (score +. -1. +. prize)
    ) votes

let call (id:int) (player:int) =
  match Hashtbl.find_opt s id with
  | Some game when game.state = VotingClosed ->
    update_scoreboard id player;
    let new_game = { game with state = (Called player); called = Some (Devkit.Time.now ()) } in
    Hashtbl.replace s id new_game
  | _ -> log #error "Failed to call game id %d" id

(*TODO per tournament and global *)
let scoreboard () =
  let data = Array.of_seq @@ Hashtbl.to_seq b in
  Array.sort (fun (_, score1) (_, score2) -> -compare score1 score2) data;
  data

let edit_score user score =
  if score = 0.0 then Hashtbl.remove b user else Hashtbl.replace b user score

let str_stats () =
  Printf.sprintf "games: %d, outstanding votes: %d, scoreboard size: %d" (Hashtbl.length s) (Hashtbl.length v) (Hashtbl.length b)

let game id user =
  (* populatie voteinfo *)
  let (voted, pool, posprize) = match user, Hashtbl.find_opt v id with
  | _, None -> None, 0, 0.
  | None, Some votes -> None, List.length votes, 0.
  | Some user, Some votes ->
    let vote = List.assoc_opt user votes in
    vote, List.length votes, (match vote with None -> 0. | Some player -> -1. +. get_pool_prize id player)
  in
  let prize = match voted, game_winner id with Some player_voted, Some player_won when player_voted = player_won -> posprize | _ -> 0. in
  match Hashtbl.find_opt s id with
  | None -> raise (Invalid_argument ("Bad game id " ^ (string_of_int id)))
  | Some game ->
    let distribution = Array.make (List.length game.players) 0 in
    List.iter (fun (_, vote) -> distribution.(vote) <- distribution.(vote) + 1) (Option.default [] @@ Hashtbl.find_opt v id);
    let usersinfo = Array.make (List.length game.players) [] in
    List.iter (fun (user, vote) -> usersinfo.(vote) <- user::usersinfo.(vote)) (Option.default [] @@ Hashtbl.find_opt v id);
    (*depending on game state, certain info is concealed *)
    let (distribution, pool) = match game.state with VotingOpen -> [||], 0 | _ -> distribution, pool in
    let usersinfo = match game.state with Called _ -> usersinfo | _ -> [||] in
    let votes = { voted; distribution; usersinfo; pool; posprize; prize } in
    { game; votes }

(* return the list of games together with coefficients, sort by creation date *)
(*TODO impose a limit? *)
let games_list user =
  let games = s |> Hashtbl.to_seq_keys |> Seq.map (fun id -> game id user) |> Array.of_seq in
  Array.sort (fun g1 g2 -> -compare g1.game.created g2.game.created) games;
  games
