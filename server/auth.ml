(** Module representing auth functionality for admin *)
open Devkit
open Prelude

let string_to_md5 = Digest.to_hex $ Digest.string

let salt = string_to_md5 @@ Time.date8hms_string @@ Time.now ()
let nr_req = ref 0

let next_key () =
  incr nr_req;
  string_to_md5 (salt ^ (Time.date8hms_string @@ Time.now()) ^ (string_of_int !nr_req))

let h_games = Hashtbl.create 1

let request_key id =
  let rec loop () =
    let key = next_key () in
    if Hashtbl.mem h_games key then ( (*Unix.sleep 1;*) loop ()) else (
      Hashtbl.add h_games key id;
      key
    )
  in
  loop ()

let id_from_key key = Hashtbl.find_opt h_games key
