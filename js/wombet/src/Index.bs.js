'use strict';

var React = require("react");
var ReactDom = require("react-dom");
var Gameboard$Wombet = require("./Gameboard/Gameboard.bs.js");
var Scoreboard$Wombet = require("./Scoreboard/Scoreboard.bs.js");
var ServerStats$Wombet = require("./ServerStats/ServerStats.bs.js");
var ExampleStyles$Wombet = require("./ExampleStyles.bs.js");

var style = document.createElement("style");

document.head.appendChild(style);

style.innerHTML = ExampleStyles$Wombet.style;

function makeContainer(text) {
  var container = document.createElement("div");
  container.className = "container";
  var title = document.createElement("div");
  title.className = "containerTitle";
  title.innerText = text;
  var content = document.createElement("div");
  content.className = "containerContent";
  container.appendChild(title);
  container.appendChild(content);
  document.body.appendChild(container);
  return content;
}

ReactDom.render(React.createElement(ServerStats$Wombet.make, {}), makeContainer("Fetch Wombet Server Stats"));

ReactDom.render(React.createElement(Scoreboard$Wombet.make, {}), makeContainer("Wombet Scoreboard"));

ReactDom.render(React.createElement(Gameboard$Wombet.make, {}), makeContainer("Wombet Games"));

exports.style = style;
exports.makeContainer = makeContainer;
/* style Not a pure module */
