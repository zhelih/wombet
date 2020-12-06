import React, { Component } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from "react-router-dom";


export default function Wombar() {
  // use as NavLink with Nav.Link to work correctly with Router
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/">
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
      </Navbar.Collapse>
    </Navbar>
  );
}
