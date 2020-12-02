'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Belt_Array = require("bs-platform/lib/js/belt_Array.js");

function Scoreboard(Props) {
  var match = React.useState(function () {
        return /* Loading */0;
      });
  var setState = match[1];
  var state = match[0];
  React.useEffect((function () {
          fetch("https://wp.lykhovyd.com/api/scoreboard").then(function (response) {
                    return response.json();
                  }).then(function (jsonResponse) {
                  if (jsonResponse.length === 0) {
                    Curry._1(setState, (function (_previousState) {
                            return /* EmptyScoreboard */2;
                          }));
                  } else {
                    Curry._1(setState, (function (_previousState) {
                            return /* LoadedScoreboard */{
                                    _0: jsonResponse
                                  };
                          }));
                  }
                  return Promise.resolve(undefined);
                }).catch(function (_err) {
                Curry._1(setState, (function (_previousState) {
                        return /* ErrorLoading */1;
                      }));
                return Promise.resolve(undefined);
              });
          
        }), []);
  var tmp;
  if (typeof state === "number") {
    switch (state) {
      case /* Loading */0 :
          tmp = "Loading Scoreboard...";
          break;
      case /* ErrorLoading */1 :
          tmp = "Error while loading a scoreboard!";
          break;
      case /* EmptyScoreboard */2 :
          tmp = "Scoreboard Empty";
          break;
      
    }
  } else {
    tmp = React.createElement("table", undefined, React.createElement("th", undefined, "Wombet Scoreboard"), Belt_Array.mapWithIndex(state._0, (function (i, row) {
                return React.createElement("tr", undefined, React.createElement("td", undefined, i + 1 | 0), React.createElement("td", undefined, row.name), React.createElement("td", undefined, row.score));
              })));
  }
  return React.createElement("div", {
              style: {
                display: "flex",
                height: "120px",
                alignItems: "center",
                justifyContent: "center"
              }
            }, tmp);
}

var make = Scoreboard;

exports.make = make;
/* react Not a pure module */
