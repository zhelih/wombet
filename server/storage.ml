open Common

let log = Devkit.Log.from "storage"

let s = Hashtbl.create 1 (* mem storage for games *)
let v = Hashtbl.create 1 (* mem storage for votes *)
let b = Hashtbl.create 1 (* mem storage for scoreboard *)

let new_game userA userB url =
  let id = Hashtbl.length s in
  let created = Devkit.Time.now () in
  let game = { state = Allowed; id; userA; userB; url; created } in
  Hashtbl.add s id game;
  id

let vote (id:int) (user:string) (aorb:bool) =
  (* check if game exists and state allows voting *)
  match Hashtbl.find_opt s id with
  | None -> raise (Failure "game not found")
  | Some game when game.state <> Allowed -> raise (Failure "not allowed")
  | _ -> ();
  (* check if already voted *)
  match Hashtbl.find_opt v id with
  | None -> Hashtbl.add v id [ user, aorb ]
  | Some votes ->
    if not @@ List.mem_assoc user votes then
      Hashtbl.replace v id ((user,aorb)::votes); (* silently ignore hehe *)
  ()

let record_start id =
  match Hashtbl.find_opt s id with
  | Some game when game.state = Allowed ->
    let new_game = { game with state = NotAllowed } in
    Hashtbl.replace s id new_game
  | _ -> log #error "Failed to record start for game id %d" id

let add_score user prize =
  match Hashtbl.find_opt b user with
  | None -> Hashtbl.add b user prize
  | Some score -> Hashtbl.replace b user (score+.prize)

(* helper func *)
let win_votes votes aorb =
  List.fold_left (fun prev (_,vote) ->
    if vote = aorb then prev+1 else prev
  ) 0 votes

let call (id:int) (aorb:bool) =
  (* find game and change state *)
  begin match Hashtbl.find_opt s id with
  | Some game when game.state = NotAllowed ->
    let state = if aorb then CalledA else CalledB in
    let new_game = { game with state; } in
    Hashtbl.replace s id new_game
  | _ -> log #error "Failed to record call for game id %d" id
  end;
  (* convert all votes and update scoreboard *)
  match Hashtbl.find_opt v id with
  | None -> ()
  | Some votes ->
    let total_votes = List.length votes in
    let win_votes = win_votes votes aorb in
    let prize = if win_votes <> 0 then ( float (total_votes - win_votes) ) /. (float win_votes) else 0. in
    List.iter (fun (user,vote) -> if aorb = vote then add_score user prize) votes;
    Hashtbl.remove v id;
    ()

let scoreboard () =
  let data = Array.of_seq @@ Hashtbl.to_seq b in
  Array.sort (fun (_, score1) (_, score2) -> -compare score1 score2) data;
  data

let edit_score user score =
  if score = 0.0 then Hashtbl.remove b user else Hashtbl.replace b user score

let str_stats () =
  Printf.sprintf "games: %d, outstanding votes: %d, scoreboard size: %d" (Hashtbl.length s) (Hashtbl.length v) (Hashtbl.length b)

let get_game_coefs game =
  let id = game.id in
  (*FIXME what about Option.value? *)
  let votes = Option.default [] @@ Hashtbl.find_opt v id in
  let voted_a = win_votes votes true in
  let voted_b = List.length votes - voted_a in
  let get_coef a b = if b <> 0 then 1. +. (float a) /. (float b) else 0. in
  (get_coef voted_a voted_b), (get_coef voted_b voted_a)

let game id =
  match Hashtbl.find_opt s id with
  | None -> raise (Invalid_argument ("Bad game id " ^ (string_of_int id)))
  | Some game ->
    game, (get_game_coefs game)

(* return the list of games together with coefficients, sort by creation date *)
(*TODO impose a limit? *)
let games_list () =
  let games = Array.of_seq @@ Hashtbl.to_seq s in
  Array.sort (fun (_,g1) (_,g2) -> -compare g1.created g2.created) games;
  (* compute current coefs *)
  games, Array.init (Array.length games) (fun ind ->
    get_game_coefs @@ snd games.(ind)
  )
