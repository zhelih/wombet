type progress =
| VotingOpen [@name "open"]
| VotingClosed [@name "closed"]
| Called of int [@name "called"]
[@@deriving show, yojson { exn = true }]

(* game info type. voting info is stored separately *)
type gameinfo =
{
  id : int;
  players : string list;
  url : string option;
  tournament: string option;
  state : progress; (*NB: includes winner info *)
  created: float; (* time when game record was added *)
  started: float option; (* time when bets closed *)
  called: float option;

  (* Devkit.Time.t
    [@of_yojson fun x -> try Ok (Yojson.Safe.Util.to_float x) with exn -> Error (Printexc.to_string exn)]
    [@to_yojson fun f -> `Float f];
  *)
} [@@deriving yojson { exn = true }]

type voteinfo =
{
  voted: int option; (* player # *)
  distribution: int array; (* # of votes for player [i] *)
  usersinfo: string list array; (* list of users who voted for player [i] *)
  pool : int; (* number of points in pool *)
  posprize : float; (* possible prize *)
  prize: float; (* actualy prize *)
} [@@deriving yojson { exn = true }]

type gameton = { game: gameinfo; votes: voteinfo } [@@deriving yojson { exn = true } ]

type gamelist = gameton array [@@deriving yojson { exn = true } ]

type score = {
  name : string;
  score : float;
} [@@deriving yojson]

type scoreboard = score array [@@deriving yojson { exn = true } ]
