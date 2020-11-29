let s = Hashtbl.create 1 (* mem storage for games *)
let v = Hashtbl.create 1 (* mem storage for votes *)
let b = Hashtbl.create 1 (* mem storage for scoreboard *)

let new_game userA userB url =
  let id = Hashtbl.length s in
  let created = Devkit.Time.now () in
  let game = { Common.state = Common.Allowed; id; userA; userB; url; created } in
  Hashtbl.add s id game;
  id

let vote (id:int) (user:string) (aorb:bool) =
  (* check if game exists and state allows voting *)
  match Hashtbl.find_opt s id with
  | None -> raise (Failure "game not found")
  | Some game when game.Common.state <> Common.Allowed -> raise (Failure "not allowed")
  | _ -> ();
  (* check if already voted *)
  match Hashtbl.find_opt v id with
  | None -> Hashtbl.add v id [ user, aorb ]
  | Some votes ->
    if not @@ List.mem_assoc user votes then
      Hashtbl.replace v id ((user,aorb)::votes); (* silently ignore hehe *)
  ()

let record_start id =
  match Hashtbl.find_opt s id with
  | Some game when game.Common.state = Common.Allowed ->
    let new_game = { game with state = Common.NotAllowed } in
    Hashtbl.replace s id new_game
  | _ -> assert false

let add_score user prize =
  match Hashtbl.find_opt b user with
  | None -> Hashtbl.add b user prize
  | Some score -> Hashtbl.replace b user (score+.prize)

let call (id:int) (aorb:bool) =
  (* find game and change state *)
  begin match Hashtbl.find_opt s id with
  | Some game when game.Common.state = Common.NotAllowed ->
    let state = if aorb then Common.CalledA else Common.CalledB in
    let new_game = { game with state; } in
    Hashtbl.replace s id new_game
  | _ -> assert false
  end;
  (* convert all votes and update scoreboard *)
  match Hashtbl.find_opt v id with
  | None -> ()
  | Some votes ->
    let total_votes = List.length votes in
    let win_votes = List.fold_left (fun prev (_,vote) ->
      if vote = aorb then prev+1 else prev
    ) 0 votes in
    let prize = ( float (total_votes - win_votes) ) /. (float win_votes) in
    List.iter (fun (user,vote) -> if aorb = vote then add_score user prize) votes;
    Hashtbl.remove v id;
    ()

let scoreboard () =
  let data = Array.of_seq @@ Hashtbl.to_seq b in
  Array.sort (fun (_, score1) (_, score2) -> -compare score1 score2) data;
  data

let edit_score user score =
  if score = 0.0 then Hashtbl.remove b user else Hashtbl.replace b user score

let str_stats () =
  Printf.sprintf "games: %d, outstanding votes: %d, scoreboard size: %d" (Hashtbl.length s) (Hashtbl.length v) (Hashtbl.length b)
