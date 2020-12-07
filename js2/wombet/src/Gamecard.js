import React, { Component } from 'react';
// bootstrap imports
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ProgressBar from 'react-bootstrap/ProgressBar';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
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
    let tournament;
    let datecreated, datestarted, datecalled;
    let voted;
    let distribution;
    let usersinfo;
    let prizeinfo;

    if (error) {
      header = <p>{error.message}</p>;
    }
    if (isLoading) {
      header = <Spinner animation="border" variant="primary" />;
    } else {
      if (game) {
        let userA=game.game.players[0];
        let userB=game.game.players[1];
        // times
        if (game.game.created) {
          const datecreatedobj = new Date(game.game.created*1000);
          datecreated = <p>Created : {datecreatedobj.toString()}</p>;
        }
        if (game.game.started) {
          const datestartedobj = new Date(game.game.started*1000);
          datestarted = <p>Started : {datestartedobj.toString()}</p>;
        }
        if (game.game.called) {
          const datecalledobj = new Date(game.game.called*1000);
          datecalled = <p>Called : {datecalledobj.toString()}</p>;
        }
        if (game.game.tournament) {
          tournament = <span className="text-secondary">{game.game.tournament}</span>;
        }
        // game extra info
        if (game.votes.voted !== null) {
          voted = <p>You voted for {game.game.players[game.votes.voted]}.</p>
        }

        if (game.votes.distribution && game.votes.distribution.length > 0) {
          const distr = game.votes.distribution;
          const total = distr[0] + distr[1];
          distribution = <span><p>Votes distribution:</p>
            <ProgressBar>
            <ProgressBar min={0} max={total} now={distr[0]} key={1} label={distr[0]} />
            <ProgressBar min={0} max={total} variant="warning" now={distr[1]} key={1} label={distr[1]} />
            </ProgressBar>
            </span>;
        }

        if (game.votes.usersinfo && game.votes.usersinfo.length > 0) {
          const voted_a = game.votes.usersinfo[0];
          const voted_b = game.votes.usersinfo[1];
          let list_a;
          let list_b;
          if (voted_a.length > 0) {
            const inside_list_a = voted_a.map(user => <ListGroup.Item>{user}</ListGroup.Item>);
            list_a = <span><p>Voted for {game.game.players[0]}:</p><ListGroup>{inside_list_a}</ListGroup></span>;
          } else {
            list_a = <span><p>No one voted for {game.game.players[0]}.</p></span>
          }
          if (voted_b.length > 0) {
            const inside_list_b = voted_b.map(user => <ListGroup.Item>{user}</ListGroup.Item>);
            list_b = <span><p>Voted for {game.game.players[1]}:</p><ListGroup>{inside_list_b}</ListGroup></span>;
          } else {
            list_b = <span><p>No one voted for {game.game.players[1]}.</p></span>
          }
          usersinfo=<span>{list_a}{list_b}</span>;
        }

        if (game.game.state[0] !== "open")
        {
          let extra_points_info;
          if (this.props.username) {
            extra_points_info = <span><p>Possible prize: {game.votes.posprize}.</p><p>Points currently received: {game.votes.prize}.</p></span>;
          }
          prizeinfo = <span><p>Points pool is {game.votes.pool}</p>{extra_points_info}</span>;
        }

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
        header = <p><span className={textcn}>{userA} vs. {userB}</span>{tournament}</p>;
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
        {datecreated}
        {datestarted}
        {datecalled}
        {voted}
        {distribution}
        {usersinfo}
        {prizeinfo}
        {body}
        </Card.Body>
	    </Accordion.Collapse>
  	</Card>
	);

  }
}

export default Gamecard;
