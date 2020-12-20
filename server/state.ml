type time = float [@@deriving yojson { exn = true} ]
(* Devkit.Time.t
  [@of_yojson fun x -> try Ok (Yojson.Safe.Util.to_float x) with exn -> Error (Printexc.to_string exn)]
  [@to_yojson fun f -> `Float f];
*)

type active =
| VotingOpen
| VotingClosed of time
| Called of { winner : int; started : time; at : time }
[@@deriving yojson { exn = true }]

type progress = Active of active | Annuled of { at : time; was : active } [@@deriving yojson { exn = true }]

type game =
{
  id : int;
  players : string list;
  mutable url : string option;
  tournament : string option;
  mutable state : progress; (* NB: includes winner info *)
  created : time; (* time when game record was added *)
  mutable votes : (string * int) list; (* list of users who voted for player [i] *)
} [@@deriving yojson { exn = true }]

type gamelist = game list [@@deriving yojson { exn = true } ]
