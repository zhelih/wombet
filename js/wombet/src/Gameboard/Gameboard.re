[@bs.val] external fetch: string => Js.Promise.t('a) = "fetch";

type state =
  | Loading
  | ErrorLoading
  | EmptyGameboard
  | LoadedGameboard(array(Js.Json.t));

[@react.component]
let make = () => {
  let (state, setState) = React.useState(() => Loading);

  React.useEffect0(() => {
    Js.Promise.(
      fetch("https://wp.lykhovyd.com/api/list")
      |> then_(response => response##json())
      |> then_(jsonResponse => {
        if (Js.Array.length(jsonResponse) == 0) {
          setState(_previousState => EmptyGameboard);
        } else {
          setState(_previousState => LoadedGameboard(jsonResponse));
        };
        Js.Promise.resolve();
      })
      |> catch(_err => {
        setState(_previousState => ErrorLoading);
        Js.Promise.resolve();
       })
       |> ignore
    );

    None;
  });

  <div
    style={ReactDOMRe.Style.make(
      ~height="120px",
      ~display="flex",
      ~alignItems="center",
      ~justifyContent="center",
      (),
    )}>
    {switch (state) {
    | ErrorLoading => React.string("Error while loading a gameboard!")
    | Loading => React.string("Loading Gameboard...")
    | EmptyGameboard => React.string("Gameboard Empty")
    | LoadedGameboard(games) =>
      games 
      ->Belt.Array.mapWithIndex((i, game) => {
        // FIXME UGLY just converting types, any better way using BS?
        let row = Obj.magic(game);
        <div>
//        <div>
//        {React.string(row##userA ++ " vs " ++ row##userB)}
//        </div>
//        {
//        if (row##url) {
//            <a href={row##url}>{React.string("Link")}</a>
//        } else {
//          <noscript />;
//        };
//        }
//        <div>{React.string(row##cA ++ " : " ++ row##cB)}</div>
//        {
//        switch (row##state) {
//        | "all" => <div><button>{React.string("Vote left")}</button>
//                   <button>{React.string("Vote right")}</button>
//                   <button>{React.string("Close voting")}</button>
//                   </div>
//        | "notall" => <div>
//                        <p>{React.string("Betting closed")}</p>
//                        <button>{React.string("Call for left")}</button>
//                        <button>{React.string("Call for right")}</button>
//                      </div>;
//        | "awon" => <p>{React.string("Won by " ++ row##userA)}</p>;
//        | "bwon" => <p>{React.string("Won by " ++ row##userB)}</p>;
//        | _ => <noscript />; // supress
//        };
//        }
        <Gamecard game=row username="testuser" />
        </div>
        })
      ->React.array
    }}
  </div>;
};
