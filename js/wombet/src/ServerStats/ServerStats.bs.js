'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");

function ServerStats(Props) {
  var match = React.useState(function () {
        return /* LoadingStats */0;
      });
  var setState = match[1];
  var state = match[0];
  React.useEffect((function () {
          fetch("https://wp.lykhovyd.com/api/stats").then(function (response) {
                    return response.text();
                  }).then(function (response) {
                  Curry._1(setState, (function (_previousState) {
                          return /* LoadedStats */{
                                  _0: response
                                };
                        }));
                  return Promise.resolve(undefined);
                }).catch(function (_err) {
                Curry._1(setState, (function (_previousState) {
                        return /* ErrorLoadingStats */1;
                      }));
                return Promise.resolve(undefined);
              });
          
        }), []);
  return React.createElement("div", {
              style: {
                display: "flex",
                height: "120px",
                alignItems: "center",
                justifyContent: "center"
              }
            }, typeof state === "number" ? (
                state !== 0 ? "An error accessing Wombet Server!" : "Loading stats..."
              ) : String(state._0));
}

var make = ServerStats;

exports.make = make;
/* react Not a pure module */
