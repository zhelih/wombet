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

  <div>
    <div>
    {React.string(game##userA ++ " vs " ++ game##userB)}
    </div>
    {
    if (game##url == Js.null) {
      <a href={Js.Null.getUnsafe(game##url)}>{React.string("Link")}</a>;
    } else {
      <noscript />;
    };
    }
    <div>{React.string(game##cA ++ " : " ++ game##cB)}</div>
    {
    switch (state) {
    | AllowedVoting => <div><button onClick={_evt => call_api("/vote?aorb=a&id=" ++ game##id ++ "&user=" ++ username, NotAllowedVoting, setState)}>{React.string("Vote left")}</button>
               <button onClick={_evt => call_api("/vote?aorb=b&id=" ++ game##id ++ "&user=" ++ username, NotAllowedVoting, setState)}>{React.string("Vote right")}</button>
               <button onClick={_evt => call_api("/start?id=" ++ game##id, NotAllowedVoting, setState)}>{React.string("Close voting")}</button>
               </div>
    | NotAllowedVoting => <div>
                    <p>{React.string("Betting closed")}</p>
                    <button onClick={_evt => call_api("/call?aorb=a&id=" ++ game##id, CalledA, setState)}>{React.string("Call for left")}</button>
                    <button onClick={_evt => call_api("/call?aorb=b&id=" ++ game##id, CalledB, setState)}>{React.string("Call for right")}</button>
                  </div>;
    | CalledA => <p>{React.string("Won by " ++ game##userA)}</p>;
    | CalledB => <p>{React.string("Won by " ++ game##userB)}</p>;
    | _ => <p>{React.string("Unexpected error")}</p>;
    };
    }
  </div>;
};
