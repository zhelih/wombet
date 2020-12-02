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
  <div className="card-deck mb-3">
    {switch (state) {
    | ErrorLoading => React.string("Error while loading a gameboard!")
    | Loading => React.string("Loading Gameboard...")
    | EmptyGameboard => React.string("Gameboard Empty")
    | LoadedGameboard(games) =>
      games 
      ->Belt.Array.mapWithIndex((i, game) => {
        // FIXME UGLY just converting types, any better way using BS?
        let row = Obj.magic(game);
        <Gamecard game=row username="testuser" />
        })
      ->React.array
    }}
  </div>;
};
