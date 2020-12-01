open Yojson.Basic.Util

let scoreboard_to_json data =
  (* convert data as Array to list and add Yojson identifiers *)
  let assoc = data |> Array.map (fun (name, score) -> name, `Float score) |> Array.to_list in
  Yojson.Basic.to_string (`Assoc assoc)

let gamelist_to_json (games, coefs) =
  let open Common in
  let json_progress = function
    | Allowed -> "all"
    | NotAllowed -> "notall"
    | CalledA -> "awon"
    | CalledB -> "bwon"
  in
  let json_array = Array.map2 (fun (_,game) (cA, cB) ->
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
  ) games coefs in
  Yojson.Basic.to_string (`List (Array.to_list json_array))
