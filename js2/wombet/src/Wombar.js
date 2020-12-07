import React, { Component } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import { COOKIEUSER } from './Api';

import { NavLink } from "react-router-dom";

class Wombar extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };
	constructor(props) {
		super(props);
    const { cookies } = this.props;
		this.state = { user: this.props.username, isLoggedIn: !!this.props.username } ;
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
	}

  handleLogin(event) {
    //const form = event.currentTarget;
    event.preventDefault(); // do not reload the page?
    event.stopPropagation();
    if (this.state.user && this.state.user.length > 0)
    {
      const { cookies } = this.props;
      cookies.set(COOKIEUSER, this.state.user);
      this.setState ({ isLoggedIn : true });
      this.props.updateusername(this.state.user); //update App username
    }
  }

  handleLogout(event) {
      const { cookies } = this.props;
      cookies.remove(COOKIEUSER);
      this.setState ({ isLoggedIn : false, user: null });
      this.props.updateusername(null); //update App username
  }

  render() {
  const loginPart = this.state.isLoggedIn ? <p>Logged as <b>{this.state.user}</b><Button size='sm' variant='outline-secondary' onClick={this.handleLogout}>Change</Button></p> :
        <Form inline onSubmit={this.handleLogin}>
          <Form.Control type="text" placeholder="username" className="mr-sm-2" value={this.state.user} onChange={e => this.setState({ user: e.target.value })}/>
          <Button type="submit" variant="outline-success">Login</Button>
        </Form>;

  // use as NavLink with Nav.Link to work correctly with Router
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand as={NavLink} to="/">
        <img src="./wombet_logo.png"
        width="30" height="30" className="d-inline-block align-top"
        alt="Wombet Logo"
      />
      WomBet</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={NavLink} to="/">Games</Nav.Link>
          <Nav.Link as={NavLink} to="/scoreboard">Scoreboard</Nav.Link>
          <Nav.Link as={NavLink} to="/newgame">New Game</Nav.Link>
        </Nav>
        {loginPart}
      </Navbar.Collapse>
    </Navbar>
  );
  }
}

export default withCookies(Wombar);
