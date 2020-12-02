'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var React = require("react");
var Js_null = require("bs-platform/lib/js/js_null.js");

function state_of_string(p) {
  switch (p) {
    case "all" :
        return /* AllowedVoting */0;
    case "awon" :
        return /* CalledA */2;
    case "bwon" :
        return /* CalledB */3;
    case "notall" :
        return /* NotAllowedVoting */1;
    default:
      return /* Unknown */4;
  }
}

function call_api(request, new_state, setState) {
  fetch("https://wp.lykhovyd.com/api" + request).then(function (_response) {
          Curry._1(setState, (function (_previousState) {
                  return new_state;
                }));
          return Promise.resolve(undefined);
        }).catch(function (_err) {
        Curry._1(setState, (function (_previousState) {
                return /* Unknown */4;
              }));
        return Promise.resolve(undefined);
      });
  
}

function Gamecard(Props) {
  var game = Props.game;
  var username = Props.username;
  var match = React.useState(function () {
        return state_of_string(game.state);
      });
  var setState = match[1];
  var tmp;
  switch (match[0]) {
    case /* AllowedVoting */0 :
        tmp = React.createElement("div", {
              "aria-label": "Voting",
              className: "btn-group btn-group-sm",
              role: "group"
            }, React.createElement("button", {
                  className: "btn btn-primary btn-sm",
                  onClick: (function (_evt) {
                      return call_api("/vote?aorb=a&id=" + (game.id + ("&user=" + username)), /* NotAllowedVoting */1, setState);
                    })
                }, "Vote left"), React.createElement("button", {
                  className: "btn btn-primary btn-sm",
                  onClick: (function (_evt) {
                      return call_api("/vote?aorb=b&id=" + (game.id + ("&user=" + username)), /* NotAllowedVoting */1, setState);
                    })
                }, "Vote right"), React.createElement("button", {
                  className: "btn btn-primary btn-sm",
                  onClick: (function (_evt) {
                      return call_api("/start?id=" + game.id, /* NotAllowedVoting */1, setState);
                    })
                }, "Close voting"));
        break;
    case /* NotAllowedVoting */1 :
        tmp = React.createElement("div", undefined, React.createElement("p", {
                  className: "text-info text-center"
                }, "Betting closed"), React.createElement("button", {
                  className: "btn btn-primary btn-sm",
                  onClick: (function (_evt) {
                      return call_api("/call?aorb=a&id=" + game.id, /* CalledA */2, setState);
                    })
                }, "Call for left"), React.createElement("button", {
                  className: "btn btn-primary btn-sm",
                  onClick: (function (_evt) {
                      return call_api("/call?aorb=b&id=" + game.id, /* CalledB */3, setState);
                    })
                }, "Call for right"));
        break;
    case /* CalledA */2 :
        tmp = React.createElement("p", {
              className: "card-text text-info text-center"
            }, "Won by " + game.userA);
        break;
    case /* CalledB */3 :
        tmp = React.createElement("p", {
              className: "card-text text-info text-center"
            }, "Won by " + game.userB);
        break;
    case /* Unknown */4 :
        tmp = React.createElement("p", {
              className: "text-danger"
            }, "Unexpected error");
        break;
    
  }
  return React.createElement("div", {
              className: "card"
            }, React.createElement("div", {
                  className: "card-body"
                }, React.createElement("h5", {
                      className: "card-title text-center"
                    }, game.userA + (" vs " + game.userB)), Js_null.test(game.url) ? React.createElement("noscript", undefined) : React.createElement("a", {
                        href: game.url
                      }, "Link"), React.createElement("h6", {
                      className: "card-subtitle mb-2 text-muted text-center"
                    }, game.cA + (" : " + game.cB)), tmp));
}

var make = Gamecard;

exports.state_of_string = state_of_string;
exports.call_api = call_api;
exports.make = make;
/* react Not a pure module */
