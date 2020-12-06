type progress =
| Allowed [@name "all"]
| NotAllowed [@name "notall"]
| CalledA [@name "awon"]
| CalledB [@name "bwon"]
[@@deriving show, yojson { exn = true }]

type game =
{
  id : int;
  userA : string;
  userB : string;
  url : string option;
  state : progress;
  created: float; (* Devkit.Time.t
    [@of_yojson fun x -> try Ok (Yojson.Safe.Util.to_float x) with exn -> Error (Printexc.to_string exn)]
    [@to_yojson fun f -> `Float f];
  *)
} [@@deriving yojson { exn = true }]

type coefs = float * float [@@deriving yojson]

type gamelist = (game * coefs) array [@@deriving yojson { exn = true } ]

type score = {
  name : string;
  score : float;
} [@@deriving yojson]

type scoreboard = score array [@@deriving yojson { exn = true } ]
