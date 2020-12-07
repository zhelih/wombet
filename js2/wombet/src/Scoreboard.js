import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';

import API from './Api';

class Scoreboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = { isLoading: false, scoreboard:[], error: null } ;
	}

	componentDidMount() {
		this.setState({ isLoading: true });

		fetch(API+'/scoreboard')
		.then(response => {
		  if (response.ok) {
				return response.json();
			} else {
				throw new Error('Failed to fetch');
			}
		})
		.then(json_data => this.setState({ scoreboard: json_data, isLoading: false }))
		.catch(error => this.setState({ error, isLoading: false }));
	}

  render() {
		const { isLoading, scoreboard, error } = this.state;
		if (error) {
			return <p>{error.message}</p>;
		}
		if (isLoading) {
			return <Spinner animation="border" variant="primary" />;
		}

		const scoreboard_items = scoreboard.map((elem, index) =>
      <tr>
      <td>{index+1}</td>
      <td>{elem.name}</td>
      <td>{elem.score}</td>
      </tr>
		);

    let scoreboard_body = <p>Scoreboard is empty.</p>
    if (scoreboard) {
      if (scoreboard.length > 0) {
        scoreboard_body = <Table striped bordered hover>
        <thead><tr>
          <th>#</th>
          <th>User</th>
          <th>Points</th>
        </tr></thead>
        <tbody>
        {scoreboard_items}
        </tbody>
        </Table>
      }
    }

    return (
    <div>
			<h2>Wombet Scoreboard</h2>
      {scoreboard_body}
    </div>
    );
  }
}

export default Scoreboard;
