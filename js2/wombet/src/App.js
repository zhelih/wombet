import React, { Component }  from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Gameboard from './Gameboard';
import Scoreboard from './Scoreboard';
import AddGame from './Addgame';
import Wombar from './Wombar';
import { CookiesProvider } from 'react-cookie';

class App extends Component {
  render() {
    return (
    <Router basename="/wombet">
     <CookiesProvider>
      <Wombar />
     </CookiesProvider>
      <Switch>
        <Route exact path="/">
          <Gameboard />
        </Route>
        <Route path="/scoreboard">
          <Scoreboard />
        </Route>
        <Route path="/newgame">
          <AddGame />
        </Route>
      </Switch>
    </Router>
    );
  }
}

export default App;
