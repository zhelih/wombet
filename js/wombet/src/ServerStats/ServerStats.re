[@bs.val] external fetch: string => Js.Promise.t('a) = "fetch";

type state =
  | LoadingStats
  | ErrorLoadingStats
  | LoadedStats(string);

[@react.component]
let make = () => {
  let (state, setState) = React.useState(() => LoadingStats);

  // Notice that instead of `useEffect`, we have `useEffect0`. See
  // reasonml.github.io/reason-react/docs/en/components#hooks for more info
  React.useEffect0(() => {
    Js.Promise.(
      fetch("https://wp.lykhovyd.com/api/stats")
      |> then_(response => response##text())
      |> then_(response => {
           setState(_previousState => LoadedStats(response));
           Js.Promise.resolve();
         })
      |> catch(_err => {
           setState(_previousState => ErrorLoadingStats);
           Js.Promise.resolve();
         })
      |> ignore
    );

    // Returning None, instead of Some(() => ...), means we don't have any
    // cleanup to do before unmounting. That's not 100% true. We should
    // technically cancel the promise. Unofortunately, there's currently no
    // way to cancel a promise. Promises in general should be way less used
    // for React components; but since folks do use them, we provide such an
    // example here. In reality, this fetch should just be a plain callback,
    // with a cancellation API
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
     | ErrorLoadingStats => React.string("An error accessing Wombet Server!")
     | LoadingStats => React.string("Loading stats...")
     | LoadedStats(stats_string) =>
       React.string(Js.String.make(stats_string))
     }}
  </div>;
};
