import React, { Component }  from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Gameboard from './Gameboard';
import Scoreboard from './Scoreboard';
import AddGame from './Addgame';
import Wombar from './Wombar';
import { CookiesProvider, withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import { COOKIEUSER } from './Api';

class App extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };
	constructor(props) {
    super(props);
    const { cookies } = this.props;
    let username = cookies.get(COOKIEUSER);
    this.state = { username } ;
    this.stateHandler = this.stateHandler.bind(this);
	}

  stateHandler(u) {
    this.setState({username: u});
  }

  render() {
    return (
    <Router basename="/wombet">
    <CookiesProvider>
      <Wombar updateusername={this.stateHandler} username={this.state.username}/>
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

export default withCookies(App);
