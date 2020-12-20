open Printf
open Devkit
open State

let log = Log.from "storage"

(** state *)

let s = Hashtbl.create 1 (* mem storage for games *)
let b = Hashtbl.create 1 (* mem storage for scoreboard *)
let last_id = ref 0

(** *)

let get id = try Hashtbl.find s id with _ -> failwith @@ sprintf "game %d not found" id

let new_game players tournament url =
  let id = incr last_id; !last_id in
  let game = {
    state = Active VotingOpen;
    id;
    players;
    url;
    tournament;
    created = Time.now ();
    votes = [];
  } in
  Hashtbl.add s id game;
  id

let vote id user player =
  let game = get id in
  (* check if state allows voting *)
  match game.state with
  | Active VotingOpen -> game.votes <- (user,player) :: List.remove_assoc user game.votes
  | _ -> failwith @@ sprintf "voting not allowed on game %d" id

let record_start id =
  let game = get id in
  match game.state with
  | Active VotingOpen -> game.state <- Active (VotingClosed (Time.now ()))
  | _ -> log #error "Game %d already started" game.id

(* helper func *)
let get_pool_prize game player =
  let pool = List.length game.votes in
  (* need firstly to know number of correct votes *)
  let nr_correct = List.fold_left (fun prev (_, vote) -> if vote = player then prev+1 else prev) 0 game.votes in
  if nr_correct <> 0 then (float pool) /. (float nr_correct) else 0.

let game_winner game =
  match game.state with
  | Active (Called { winner; _ }) -> Some winner
  | _ -> None

let update_scoreboard game player =
  (* now pool = number of votes *)
  let prize = get_pool_prize game player in
  game.votes |> List.iter begin fun (user, vote) ->
    let score = Option.default 0. @@ Hashtbl.find_opt b user in
    let prize = if vote = player then prize else 0. in
    Hashtbl.replace b user (score +. -1. +. prize)
  end

let call id winner =
  let game = get id in
  match game.state with
  | Active (VotingClosed started) ->
    update_scoreboard game winner;
    game.state <- Active (Called { winner; started; at = Time.now () })
  | _ -> log #error "Failed to call game id %d" id

let edit_score user score =
  if abs_float score < epsilon_float then Hashtbl.remove b user else Hashtbl.replace b user score

let str_stats () =
  sprintf "games: %d, scoreboard size: %d" (Hashtbl.length s) (Hashtbl.length b)

let remove id =
  let game = get id in
  match game.state with
  | Active was -> game.state <- Annuled { at = Time.now (); was }
  | Annuled { at; _ } -> log #info "Game %d already annuled on %s" id (Time.gmt_string at)

let replace_url id url =
  let game = get id in
  game.url <- if url = "" then None else Some url

module Export = struct

(*TODO*)
let tournaments () = [ "Tm 1"; "Tm 2"; "Tm 3" ]

let make_game g =
  let state, started, called =
    match g.state with
    | Annuled _ -> Shared.Annulled, None, None
    | Active p ->
    match p with
    | VotingOpen -> VotingOpen, None, None
    | VotingClosed at -> VotingClosed, Some at, None
    | Called { started; at; winner } -> Called winner, Some started, Some at
  in
  Shared.{
    id = g.id;
    url = g.url;
    tournament = g.tournament;
    players = g.players;
    created = g.created;
    started;
    called;
    state;
  }

let game id ?(admin=false) user =
  (* populate voteinfo *)
  let game = get id in
  let state =
    match game.state with
    | Active p -> p
    | Annuled _ -> failwith @@ sprintf "game %d annuled" id
  in
  let voted = match user with None -> None | Some user -> List.assoc_opt user game.votes in
  let posprize = match voted with None -> 0. | Some player -> -1. +. get_pool_prize game player in
  let pool = List.length game.votes in
  let prize =
    match voted, game_winner game with
    | Some player_voted, Some player_won when player_voted = player_won -> posprize
    | None, _ -> 0.
    | _ -> -1.
  in
  let distribution = Array.make (List.length game.players) 0 in
  List.iter (fun (_, vote) -> distribution.(vote) <- distribution.(vote) + 1) game.votes;
  let usersinfo = Array.make (List.length game.players) [] in
  List.iter (fun (user, vote) -> usersinfo.(vote) <- user::usersinfo.(vote)) game.votes;
  (*depending on game state, certain info is concealed *)
  let (distribution, pool) = match admin, state with false, VotingOpen -> [||], 0 | _ -> distribution, pool in
  let usersinfo = match admin, state with true, _ -> usersinfo | false, Called _ -> usersinfo | _ -> [||] in
  let votes = Shared.{ voted; distribution; usersinfo; pool; posprize; prize } in
  Shared.{ game = make_game game; votes }

(* return the list of games together with coefficients, sort by creation date *)
(*TODO impose a limit? *)
let games_list user =
  let games = s |> Hashtbl.to_seq_keys |> Seq.map (fun id -> game id user) |> Array.of_seq in
  Array.sort (fun g1 g2 -> -compare g1.Shared.game.created g2.game.created) games;
  games

(*TODO per tournament and global *)
let scoreboard _tournament =
  let data = Array.of_seq @@ Hashtbl.to_seq b in
  Array.sort (fun (_, score1) (_, score2) -> -compare score1 score2) data;
  data |> Array.map (fun (name, score) -> Shared.{ name; score })

end
