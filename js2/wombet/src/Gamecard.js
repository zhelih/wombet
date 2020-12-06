import React, { Component } from 'react';
// bootstrap imports
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import API from './Api';

class Gamecard extends React.Component {
	constructor(props) {
		super(props);
		this.state = { needsUpdate: true, isLoading: false, game:null, error: null } ;
    this.props.prevUsername = this.props.username;
    this.handleClick = this.handleClick.bind(this);
    this.updateGameData = this.updateGameData.bind(this);
	}

	componentDidMount() {
    this.updateGameData()
  }

  componentDidUpdate() {
    if (this.state.needsUpdate || (this.props.username && this.props.prevUserName !== this.props.username)) {
      this.props.prevUserName = this.props.username;
      this.updateGameData()
    }
  }

  updateGameData() {
		this.setState({ isLoading: true, needsUpdate: false });

    let query=API+'/game?id='+this.props.gameid;
    if (this.props.username) {
      query = query + '&user=' + this.props.username;
    }
		fetch(query)
		.then(response => {
		  if (response.ok) {
				return response.json();
			} else {
				throw new Error('Failed to fetch');
			}
		})
		.then(json_data => this.setState({ game: json_data, isLoading: false, needsUpdate: false }))
		.catch(error => this.setState({ error, isLoading: false, needsUpdate:false }));
	}

  handleClick(req) {
    if(this.props.username) {
    fetch(API+req+'id='+this.state.game.game.id+'&user='+this.props.username)
    .then(response => {
      if(response.ok) {
        // trigger repaint
        this.setState({ needsUpdate: true })
      } else {
        throw new Error('Failed to fetch on click');
      }
    })
    .catch(error => this.setState({error, isLoading: false}));
    } else {
      //TODO alert to log in
    }
  }
  render() {
		const { isLoading, game, error } = this.state;
    let header;
    let body = <p>Nothing here.</p>;
    let textcn;
    if (error) {
      header = <p>{error.message}</p>;
    }
    if (isLoading) {
      header = <p>Gamecard is loading...</p>;
    } else {
      if (game) {
        let userA=game.game.players[0];
        let userB=game.game.players[1];
        if (game.game.state[0] === "open") {
          // allowed voting
          textcn='text-primary';
          body = <ButtonGroup>
            <Button variant="primary" disabled={!this.props.username} onClick={() => this.handleClick('/vote?player=0&')}>Vote left</Button>
            <Button variant="primary" disabled={!this.props.username} onClick={() => this.handleClick('/vote?player=1&')}>Vote right</Button>
            <Button variant="warning" onClick={() => this.handleClick('/start?')}>Close bets</Button>
          </ButtonGroup>;
        } else if (game.game.state[0] === "closed") {
          textcn='text-dark';
          body = <div>
                  <p className='text-info'>Bets are closed, awaiting the end.</p>
                  <Button variant="success" onClick={() => this.handleClick('/call?player=0&')}>Call Left Win</Button>
                  <Button variant="success" onClick={() => this.handleClick('/call?player=1&')}>Call Right Win</Button>
                </div>;
        } else if (game.game.state[0] === "called") {
          textcn='text-dark';
          body = <p className="text-success">{game.game.players[game.game.state[1]]} won the game.</p>;
//          userA = <span className='font-weight-bold'>{game.userA}</span>;
//        TODO bold
        } else {
          textcn='text-dark';
          body = <p className="text-danger">Error in parsing game state.</p>;
        }
        header = <p><span className={textcn}>{userA} vs. {userB}</span><span className="text-secondary">todo tournament</span></p>;
      } else {
        header = <p>Empty</p>;
      }
    }

    return (
	  <Card>
  	  <Card.Header>
    	  <Accordion.Toggle as={Button} variant="link" eventKey={this.props.gameid+1}>
          {header}
	      </Accordion.Toggle>
        {game && game.game.url ? <a className="text-right" href={game.game.url} target='blank_'>Link</a> : <noscript />}
  	  </Card.Header>
    	<Accordion.Collapse eventKey={this.props.gameid+1}>
      	<Card.Body>
        <p>Debug: current user is {this.props.username}.</p><br/>
        {body}
        </Card.Body>
	    </Accordion.Collapse>
  	</Card>
	);

  }
}

export default Gamecard;
