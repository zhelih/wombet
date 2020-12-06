type progress = Allowed | NotAllowed | CalledA | CalledB
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
