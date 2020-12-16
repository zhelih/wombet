import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

function VoteList(props) {
  const game = props.game;
	if (game && game.votes && game.votes.usersinfo && game.votes.usersinfo.length > 0) {
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
    return <span>{list_a}{list_b}</span>;
  }
  return <div/>;
}

export default VoteList;
