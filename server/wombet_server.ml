open Devkit
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
(*
  | "/list" ->
    (* return games list *)
*)
  | "/scoreboard" ->
    let _scoreboard = Storage.scoreboard () in
    (* TODO serialize nicely *)
    k @@ (`Ok, [], "")
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
  Httpev.server config answer

