import React, { Component } from 'react';
import Gamecard from './Gamecard';
// bootstrap imports
import Accordion from 'react-bootstrap/Accordion';
const API="https://wp.lykhovyd.com/api";

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

		const games_items = games.map(game =>
			<Gamecard gameid={game.id} username='testuser'/>
		);

    return (
			<div>
			<h1>Wombet Gameboard</h1>
			<Accordion>
			{games_items}
			</Accordion>
			</div>
    );
  }
}

export default Gameboard;