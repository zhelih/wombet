open Devkit
open Prelude

let answer _serv req k =
  let module Arg = Httpev.Args(struct let req = req end) in
  match req.Httpev_common.path with
  | "/add" ->
    let userA = Arg.str "userA" in
    let userB = Arg.str "userB" in
    let url = Arg.get "url" in
    let id = Storage.new_game userA userB url  in
    k @@ (`Ok,[],string_of_int id)
  | "/vote" ->
    let user = Arg.str "user" in
    let id = Arg.int "id" in
    let aorb = "a" == Arg.str "aorb" in
    Storage.vote id user aorb;
    k @@ (`Ok,[],"")
  | "/start" ->
    let id = Arg.int "id" in
    Storage.record_start id;
    k @@ (`Ok,[],"")
  | "/call" ->
    (* id, a or b *)
    let id = Arg.int "id" in
    let aorb = "a" == Arg.str "aorb" in
    Storage.call id aorb;
    k @@ (`Ok, [], "")

  | "/list" ->
    let gameslist = Serialize.gamelist_to_json @@ Storage.games_list () in
    k @@ (`Ok, [], gameslist)
    (* return games list *)
  | "/scoreboard" ->
    let scoreboard = Serialize.scoreboard_to_json @@ Storage.scoreboard () in
    k @@ (`Ok, [], scoreboard)
  | "/edit" ->
    let user = Arg.str "user" in
    let score = Arg.float "score" in
    Storage.edit_score user score;
    k @@ (`Ok, [], "")
  | "/stats" ->
    let stats = Storage.str_stats () in
    k @@ (`Ok, [], stats)
  | _ -> k @@ Httpev.not_found


let () =
  let config = { Httpev.default with connection = Unix.ADDR_INET (Unix.inet_addr_loopback, 8000); name = "Wombet server" } in
  begin try
    ExtArg.parse Daemon.args;
  with exn -> printfn "Error: %s" (Exn.str exn) end;
  Daemon.manage (); (* daemonize *)
  Httpev.server config answer

