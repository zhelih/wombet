'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Belt_Array = require("bs-platform/lib/js/belt_Array.js");
var Gamecard$Wombet = require("./Gamecard.bs.js");

function Gameboard(Props) {
  var match = React.useState(function () {
        return /* Loading */0;
      });
  var setState = match[1];
  var state = match[0];
  React.useEffect((function () {
          fetch("https://wp.lykhovyd.com/api/list").then(function (response) {
                    return response.json();
                  }).then(function (jsonResponse) {
                  if (jsonResponse.length === 0) {
                    Curry._1(setState, (function (_previousState) {
                            return /* EmptyGameboard */2;
                          }));
                  } else {
                    Curry._1(setState, (function (_previousState) {
                            return /* LoadedGameboard */{
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
          tmp = "Loading Gameboard...";
          break;
      case /* ErrorLoading */1 :
          tmp = "Error while loading a gameboard!";
          break;
      case /* EmptyGameboard */2 :
          tmp = "Gameboard Empty";
          break;
      
    }
  } else {
    tmp = Belt_Array.mapWithIndex(state._0, (function (i, game) {
            return React.createElement(Gamecard$Wombet.make, {
                        game: game,
                        username: "testuser"
                      });
          }));
  }
  return React.createElement("div", {
              className: "card-deck mb-3"
            }, tmp);
}

var make = Gameboard;

exports.make = make;
/* react Not a pure module */
