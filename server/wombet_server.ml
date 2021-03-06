open Devkit

module Export = Storage.Export

let log = Log.from "server"

let with_key key f =
  match Auth.id_from_key key with
  | Some id -> f id
  | None -> Httpev.Answer.error `Forbidden "invalid key"

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
      let id = Storage.new_game players tournament url in
      let key = Auth.request_key id in
      yojson @@ Shared.(addinfo_to_yojson { id; key })
    end
  | "/vote" ->
    let user = Arg.str "user" in
    let id = Arg.int "id" in
    let player = Arg.int "player" in
    Storage.vote id user player;
    text ""
  | "/start" ->
    let key = Arg.str "key" in
    with_key key (fun id ->
      Storage.record_start id;
      text ""
    )
  | "/call" ->
    let key = Arg.str "key" in
    let player = Arg.int "player" in
    with_key key (fun id ->
      Storage.call id player;
      text ""
    )
  | "/game" ->
    let id = Arg.int "id" in
    let user = Arg.get "user" in
    yojson @@ Shared.gameton_to_yojson @@ Export.game id user
  | "/admingame" ->
    let key = Arg.str "key" in
    with_key key (fun id ->
      yojson @@ Shared.gameton_to_yojson @@ Export.game ~admin:true id None
    )
  | "/remove" ->
    let key = Arg.str "key" in
    with_key key (fun id ->
      Storage.remove id;
      text ""
    )
  | "/editurl" ->
    let key = Arg.str "key" in
    let url = Arg.str "url" in
    with_key key (fun id ->
      Storage.replace_url id url;
      text ""
    )
  | "/list" ->
    let user = Arg.get "user" in
    yojson @@ Shared.gamelist_to_yojson @@ Export.games_list user
  | "/scoreboard" ->
    let tm = Arg.get "tournament" in
    yojson @@ Shared.scoreboard_to_yojson @@ Export.scoreboard tm
  | "/tournaments" ->
    let serialize l = `List (List.map (fun t -> `String t) l) in
    yojson @@ serialize @@ Export.tournaments ()
  | "/edit" ->
    let user = Arg.str "user" in
    let score = Arg.float "score" in
    Storage.edit_score user score;
    text ""
  (* fallback to unknown request if pid param in incorrect *)
  | "/list_keys" when Arg.get "pid" = Some (string_of_int @@ Unix.getpid ()) ->
    let res = List.map (fun (key, id) -> Printf.sprintf "%d: %s" id key) @@ Auth.list_keys () in
    text @@ String.concat "\n" res
  | "/stats" ->
    text @@ Storage.str_stats ()
  | _ -> not_found "unknown request"


let () =
  let access_log = ref (open_out "wombet.log") in
  ExtArg.parse Daemon.args;
  Daemon.manage (); (* daemonize *)
  let config = { Httpev.default with connection = Unix.ADDR_INET (Unix.inet_addr_loopback, 8000); name = "Wombet server"; access_log; } in
  Httpev.server_lwt config answer
