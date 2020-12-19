import React, { Component } from 'react';
// bootstrap imports
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Collapse from 'react-bootstrap/Collapse';
import VoteList from './GameVotes';

import { API } from './Api';

class AdminPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: false, gamekey: null, gameinfo: null, formgamekey: null, error: null, success: false, collapsed: false, gameurl: null} ;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleURLedit = this.handleURLedit.bind(this);
  }

  handleClick(req) {
    fetch(API+req+'key='+this.state.gamekey)
    .then(response => {
      if(response.ok) {
        // trigger repaint
        this.setState({ success: true })
      } else {
        throw new Error('Failed to fetch on click');
      }
    })
    .catch(error => this.setState({error: error.message, gamekey: null, gameinfo: null}));
  }

  handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ isLoading: true });
    const key = this.state.formgamekey;

    let query = API + '/admingame?key='+key;
    fetch(query)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to receive admin rights with key '+key+'.');
      }
    })
    .then(json_data => this.setState({ gameinfo: json_data, isLoading: false, gamekey: key }))
    .catch(error => this.setState({ error: error.message, isLoading: false, gamekey: null, gameinfo: null }));
  }

  handleURLedit() {
    const key = this.state.gamekey;
    const url = this.state.gameurl ? encodeURIComponent(this.state.gameurl) : "";
    fetch(API+'/editurl?key='+key+'&url='+url)
    .then(response => {
      if(response.ok) {
        // trigger repaint
        this.setState({ success: true })
      } else {
        throw new Error('Failed to fetch on click');
      }
    })
    .catch(error => this.setState({error: error.message, gamekey: null, gameinfo: null}));
  }

  render() {
    const { isLoading, gamekey, gameinfo, error, formgamekey } = this.state;
    if (isLoading) {
      return <Spinner animation="border" variant="primary" />;
    }

    let error_alert;
    if (error) {
      error_alert = <Alert variant="danger" onClose={() => this.setState({ error: null })} dismissible>{error}</Alert>;
    }

    if (!gamekey) {
      return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        <Form.Row className="align-items-center">
        <Col xs="auto">
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="admin-key1" >Admin Key</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              placeholder="Enter here"
              aria-label="Game Admin Key"
              aria-describedby="admin-key1"
              required value={formgamekey} onChange={e => this.setState({ formgamekey: e.target.value})}
            />
          </InputGroup>
        </Col>
        <Col xs="auto">
          <Button type="submit" variant="primary" className="mb-2">Load</Button>
        </Col>
        </Form.Row>
      </Form>
      <br />
      {error_alert}
      </div>
      );
    }
    let success_alert;
    if (this.state.success) {
      success_alert = <Alert variant="success" onClose={() => this.setState({ success: false })} dismissible>Success!</Alert>;
    }
    const votes_body = <span>
      <Button onClick={() => this.setState({ collapsed: !this.state.collapsed })}>Votes</Button>
      <Collapse in={this.state.collapsed}>
        <div>
        <VoteList game={this.state.gameinfo} />
        </div>
      </Collapse>
      </span>;
    // FIXME copy from Gamecard, better to create a separate element?

    return (
      <div>
        <p>Game id : {gameinfo.game.id}</p>
        <p>Players: {gameinfo.game.players[0]} vs {gameinfo.game.players[1]}</p>
        <p>Tournament: {gameinfo.game.tournament}</p>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="url-addon">URL</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            placeholder="empty to delete"
            aria-label="game url"
            aria-describedby="url-addon"
            value={this.state.gameurl}
            onChange={e => this.setState({ gameurl: e.target.value})}
          />
          <InputGroup.Append>
            <Button
              variant="outline-secondary"
              onClick={this.handleURLedit}>
            Edit</Button>
          </InputGroup.Append>
        </InputGroup> 
        <br />
        <Button variant="warning" onClick={() => this.handleClick('/start?')}>Close bets</Button>
        <br />
        <Button variant="success" onClick={() => this.handleClick('/call?player=0&')}>Call Left Win</Button>
        <Button variant="success" onClick={() => this.handleClick('/call?player=1&')}>Call Right Win</Button>
        <br />
        {votes_body}
        {success_alert}
      </div>
    );
  }
}

export default AdminPanel;
