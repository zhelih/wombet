import React, { Component }  from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Gameboard from './Gameboard';
import Scoreboard from './Scoreboard';
import AddGame from './Addgame';
import Wombar from './Wombar';
import { CookiesProvider } from 'react-cookie';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {username: null} ;
    this.stateHandler = this.stateHandler.bind(this);
	}

  stateHandler(u) {
    this.setState({username: u});
  }

  render() {
    return (
    <Router basename="/wombet">
     <CookiesProvider>
      <Wombar updateusername={this.stateHandler}/>
     </CookiesProvider>
      <Switch>
        <Route exact path="/">
          <Gameboard username={this.state.username} />
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
