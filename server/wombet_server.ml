open Devkit

let answer _ req =
  let module Arg = Httpev.Args(struct let req = req end) in
  let open Httpev.Answer in
  match req.Httpev_common.path with
  | "/add" ->
    let userA = Arg.str "userA" in
    let userB = Arg.str "userB" in
    let url = Arg.get "url" in
    let id = Storage.new_game userA userB url  in
    text @@ string_of_int id
  | "/vote" ->
    let user = Arg.str "user" in
    let id = Arg.int "id" in
    let aorb = "a" = Arg.str "aorb" in
    Storage.vote id user aorb;
    text ""
  | "/start" ->
    let id = Arg.int "id" in
    Storage.record_start id;
    text ""
  | "/call" ->
    (* id, a or b *)
    let id = Arg.int "id" in
    let aorb = "a" = Arg.str "aorb" in
    Storage.call id aorb;
    text ""
  | "/game" ->
    let id = Arg.int "id" in
    yojson @@ Serialize.game_to_json @@ Storage.game id
  | "/list" ->
    yojson @@ Serialize.gamelist_to_json @@ Storage.games_list ()
    (* return games list *)
  | "/scoreboard" ->
    yojson @@ Serialize.scoreboard_to_json @@ Storage.scoreboard ()
  | "/edit" ->
    let user = Arg.str "user" in
    let score = Arg.float "score" in
    Storage.edit_score user score;
    text ""
  | "/stats" ->
    text @@ Storage.str_stats ()
  | _ -> not_found "wut"


let () =
  let config = { Httpev.default with connection = Unix.ADDR_INET (Unix.inet_addr_loopback, 8000); name = "Wombet server" } in
  ExtArg.parse Daemon.args;
  Daemon.manage (); (* daemonize *)
  Httpev.server_lwt config answer
