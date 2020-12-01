[@bs.val] external fetch: string => Js.Promise.t('a) = "fetch";

type state =
  | Loading
  | ErrorLoading
  | EmptyScoreboard
  | LoadedScoreboard(array(Js.Json.t));

[@react.component]
let make = () => {
  let (state, setState) = React.useState(() => Loading);

  React.useEffect0(() => {
    Js.Promise.(
      fetch("https://wp.lykhovyd.com/api/scoreboard")
      |> then_(response => response##json())
      |> then_(jsonResponse => {
        if (Js.Array.length(jsonResponse) == 0) {
          setState(_previousState => EmptyScoreboard);
        } else {
          setState(_previousState => LoadedScoreboard(jsonResponse));
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
    <table><th>{React.string("Wombet Scoreboard")}</th>
    {switch (state) {
    | ErrorLoading => React.string("Error while loading a scoreboard!")
    | Loading => React.string("Loading Scoreboard...")
    | EmptyScoreboard => React.string("Scoreboard Empty")
    | LoadedScoreboard(users) =>
      users
      ->Belt.Array.mapWithIndex((i, row) => {
        // FIXME UGLY just converting types, any better way using BS?
        let row_object = Obj.magic(row);
        <tr><td>{React.int(i+1)}</td><td>{React.string(row_object##name)}</td><td>{React.float(row_object##score)}</td></tr>
        })
      ->React.array
    }}
  </table>
  </div>;
};
