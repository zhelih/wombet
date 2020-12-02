[@bs.val] external fetch: string => Js.Promise.t('a) = "fetch";

type state =
  | AllowedVoting
  | NotAllowedVoting
  | CalledA
  | CalledB
  | Unknown;

let state_of_string = (p) =>
    switch(p) {
      | "all" => AllowedVoting
      | "notall" => NotAllowedVoting
      | "awon" => CalledA
      | "bwon" => CalledB
      | _ => Unknown
    };

// call api without need to process the result
// true if success, false otherwise
let call_api = (request, new_state, setState) => {
    Js.Promise.(
      fetch("https://wp.lykhovyd.com/api" ++ request) // TODO urlencode?
      |> then_(_response => {
        setState(_previousState => new_state);
        Js.Promise.resolve();
      })
      |> catch(_err => {
        setState(_previousState => Unknown);
        Js.Promise.resolve();
       })
      |> ignore
    );
};

[@react.component]
let make = (~game, ~username) => {
  let (state, setState) = React.useState(() => state_of_string(game##state));

//  React.useEffect0(() => {
//    None;
//  });

  <div className="card">
    <div className="card-body">
    <h5 className="card-title text-center">{React.string(game##userA ++ " vs " ++ game##userB)}</h5>
    {
    if (!Js.Null.test(game##url)) {
      <a href={Js.Null.getUnsafe(game##url)}>{React.string("Link")}</a>;
    } else {
      <noscript />;
    }
    }
    <h6 className="card-subtitle mb-2 text-muted text-center">{React.string(game##cA ++ " : " ++ game##cB)}</h6>
    {
    switch (state) {
    | AllowedVoting =>
              <div className="btn-group btn-group-sm" role="group" ariaLabel="Voting">
                <button className="btn btn-primary btn-sm" onClick={_evt => call_api("/vote?aorb=a&id=" ++ game##id ++ "&user=" ++ username, NotAllowedVoting, setState)}>{React.string("Vote left")}</button>
                <button className="btn btn-primary btn-sm" onClick={_evt => call_api("/vote?aorb=b&id=" ++ game##id ++ "&user=" ++ username, NotAllowedVoting, setState)}>{React.string("Vote right")}</button>
                <button className="btn btn-primary btn-sm" onClick={_evt => call_api("/start?id=" ++ game##id, NotAllowedVoting, setState)}>{React.string("Close voting")}</button>
              </div>;
    | NotAllowedVoting => <div>
                    <p className="text-info text-center">{React.string("Betting closed")}</p>
                    <button className="btn btn-primary btn-sm" onClick={_evt => call_api("/call?aorb=a&id=" ++ game##id, CalledA, setState)}>{React.string("Call for left")}</button>
                    <button className="btn btn-primary btn-sm" onClick={_evt => call_api("/call?aorb=b&id=" ++ game##id, CalledB, setState)}>{React.string("Call for right")}</button>
                  </div>;
    | CalledA => <p className="card-text text-info text-center">{React.string("Won by " ++ game##userA)}</p>;
    | CalledB => <p className="card-text text-info text-center">{React.string("Won by " ++ game##userB)}</p>;
    | _ => <p className="text-danger">{React.string("Unexpected error")}</p>;
    }
    }
    </div>
  </div>;
};
