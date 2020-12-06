open Devkit

let log = Log.from "server"

let answer _ req =
  let module Arg = Httpev.Args(struct let req = req end) in
  let open Httpev.Answer in
  match req.Httpev_common.path with
  | "/add" ->
    let players = Arg.array "players" in
    let url = Arg.get "url" in
    let tournament = Arg.get "tm" in
    if List.length players < 2 then begin
      log #warn "not enough players %d" (List.length players);
      not_found @@ "not enough players"
    end else begin
      let id = Storage.new_game players tournament url  in
      text @@ string_of_int id
    end
  | "/vote" ->
    let user = Arg.str "user" in
    let id = Arg.int "id" in
    let player = Arg.int "player" in
    Storage.vote id user player;
    text ""
  | "/start" ->
    let id = Arg.int "id" in
    Storage.record_start id;
    text ""
  | "/call" ->
    (* id, a or b *)
    let id = Arg.int "id" in
    let player = Arg.int "player" in
    Storage.call id player;
    text ""
  | "/game" ->
    let id = Arg.int "id" in
    let user = Arg.get "user" in
    yojson @@ Common.gameton_to_yojson @@ Storage.game id user
  | "/list" ->
    let user = Arg.get "user" in
    yojson @@ Common.gamelist_to_yojson @@ Storage.games_list user
  | "/scoreboard" ->
    yojson @@ Serialize.scoreboard_to_json @@ Storage.scoreboard ()
  | "/edit" ->
    let user = Arg.str "user" in
    let score = Arg.float "score" in
    Storage.edit_score user score;
    text ""
  | "/stats" ->
    text @@ Storage.str_stats ()
  | _ -> not_found "unknown request"


let () =
  let access_log = ref (open_out "wombet.log") in
  ExtArg.parse Daemon.args;
  Daemon.manage (); (* daemonize *)
  let config = { Httpev.default with connection = Unix.ADDR_INET (Unix.inet_addr_loopback, 8000); name = "Wombet server"; access_log; } in
  Httpev.server_lwt config answer
