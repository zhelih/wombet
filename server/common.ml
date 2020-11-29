type progress = Allowed | NotAllowed | CalledA | CalledB
type game =
{
  id : int;
  userA : string;
  userB : string;
  url : string option;
  state : progress;
  created: Devkit.Time.t;
}

