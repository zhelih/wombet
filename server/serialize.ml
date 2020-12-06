open Yojson.Basic.Util

let scoreboard_to_json data =
  `List (data |> Array.map (fun (name, score) -> `Assoc ["name", `String name; "score", `Float score ]) |> Array.to_list)

let game_to_json (game, (cA, cB)) =
  let open Common in
  let json_progress = function
    | Allowed -> "all"
    | NotAllowed -> "notall"
    | CalledA -> "awon"
    | CalledB -> "bwon"
  in
 `Assoc ([
   "id", `Int game.id;
   "userA", `String game.userA;
   "userB", `String game.userB;
   "url", (match game.url with None -> `Null | Some u -> `String u);
   (*TODO convert time on client side *)
   "created", `String (Devkit.Time.to_string game.created);
   "state", `String (json_progress game.state);
   "cA", `Float cA;
   "cB", `Float cB;
 ])

let gamelist_to_json (games, coefs) =
  let json_array = Array.map2 (fun (_,game) (cA, cB) ->
    game_to_json (game, (cA, cB))
  ) games coefs in
  `List (Array.to_list json_array)
