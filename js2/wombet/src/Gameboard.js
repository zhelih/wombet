import React, { Component } from 'react';
import Gamecard from './Gamecard';
import Button from 'react-bootstrap/Button';
// bootstrap imports
import Accordion from 'react-bootstrap/Accordion';
import API from './Api';

class Gameboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = { isLoading: false, games:[], error: null } ;
	}

	componentDidMount() {
		this.setState({ isLoading: true });

		fetch(API+'/list')
		.then(response => {
		  if (response.ok) {
				return response.json();
			} else {
				throw new Error('Failed to fetch');
			}
		})
		.then(json_data => this.setState({ games: json_data, isLoading: false }))
		.catch(error => this.setState({ error, isLoading: false }));
	}
  render() {
		const { isLoading, games, error } = this.state;
		if (error) {
			return <p>{error.message}</p>;
		}
		if (isLoading) {
			return <p>Gameboard is loading...</p>;
		}

   let gameboard_body = <p>No games yet.</p>
    if (games) {
      if (games.length > 0) {
				const games_items = games.map(game =>
					<Gamecard gameid={game.id} username={this.props.username}/>
				);
				gameboard_body = <Accordion>
						{games_items}
						</Accordion>;
			}
		}


    return (
			<div>
			<h2>Wombet Gameboard</h2>
			{gameboard_body}
			</div>
    );
  }
}

export default Gameboard;
