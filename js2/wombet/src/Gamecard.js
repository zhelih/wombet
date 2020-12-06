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
    this.handleClick = this.handleClick.bind(this);
    this.updateGameData = this.updateGameData.bind(this);
	}

	componentDidMount() {
    this.updateGameData()
  }

  componentDidUpdate() {
    if (this.state.needsUpdate) {
      this.updateGameData()
    }
  }

  updateGameData() {
		this.setState({ isLoading: true, needsUpdate: false });

		fetch(API+'/game?id='+this.props.gameid)
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
    fetch(API+req+'id='+this.state.game.id+'&user='+this.props.username)
    .then(response => {
      if(response.ok) {
        // trigger repaint
        this.setState({ needsUpdate: true })
      } else {
        throw new Error('Failed to fetch on click');
      }
    })
    .catch(error => this.setState({error, isLoading: false}));
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
        let userA=game.userA;
        let userB=game.userB;
        if (game.state === "all") {
          // allowed voting
          textcn='text-primary';
          body = <ButtonGroup>
            <Button variant="primary" onClick={() => this.handleClick('/vote?aorb=a&')}>Vote left</Button>
            <Button variant="primary" onClick={() => this.handleClick('/vote?aorb=b&')}>Vote right</Button>
            <Button variant="warning" onClick={() => this.handleClick('/start?')}>Close bets</Button>
          </ButtonGroup>;
        } else if (game.state === "notall") {
          textcn='text-dark';
          body = <div>
                  <p className='text-info'>Bets are closed, awaiting the end.</p>
                  <Button variant="success" onClick={() => this.handleClick('/call?aorb=a&')}>Call Left Win</Button>
                  <Button variant="success" onClick={() => this.handleClick('/call?aorb=b&')}>Call Right Win</Button>
                </div>;
        } else if (game.state === "awon") {
          textcn='text-dark';
          body = <p className="text-success">{game.userA} won the game.</p>;
          userA = <span className='font-weight-bold'>{game.userA}</span>;
        } else if (game.state === "bwon") {
          textcn='text-dark';
          body = <p className="text-success">{game.userB} won the game.</p>;
          userB = <span className='font-weight-bold'>{game.userB}</span>;
        } else {
          textcn='text-dark';
          body = <p className="text-danger">Error in parsing game state.</p>;
        }
        header = <p><span className={textcn}>{userA} vs. {userB}</span><span className="text-secondary">{game.cA} : {game.cB}</span></p>;
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
        {game && game.url ? <a className="text-right" href={game.url} target='blank_'>Link</a> : <noscript />}
  	  </Card.Header>
    	<Accordion.Collapse eventKey={this.props.gameid+1}>
      	<Card.Body>{body}</Card.Body>
	    </Accordion.Collapse>
  	</Card>
	);

  }
}

export default Gamecard;
