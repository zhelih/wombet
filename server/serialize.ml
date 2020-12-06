open Yojson.Basic.Util

let scoreboard_to_json data =
  data |> Array.map (fun (name, score) -> Common.{ name; score }) |> Common.scoreboard_to_yojson

(* gamelist_to_yojson *)
(* gameinfo_to_yojson *)
(* etc. *)
