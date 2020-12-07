import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { API } from './Api';

class AddGame extends React.Component {
	constructor(props) {
		super(props);
		this.state = { validated: false, userA: null, userB: null, url: null, urlInvalid: false } ;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUrlChange = this.handleUrlChange.bind(this);
	}

  async handleSubmit(event) {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity() === true) {
      this.setState({ validated: true });
      // send API add game
      let api_string = API+'/add?players[]='+this.state.userA+'&players[]='+this.state.userB;
      if (this.state.url) {
        api_string = api_string + '&url=' + encodeURIComponent(this.state.url);
      }
  		await fetch(api_string)
	  	.then(response => {
        //FIXME silent for errors
//		    if (response.ok) {
//  			} else {
//	  			throw new Error('Failed to fetch');
//		  	}
  		})
		  .catch(error => console.log(error));
    //  const history = useHistory();
//      history.push('/');
      this.props.history.push("/");
	  } else {
      this.setState({ validated: true });
    }
  }

  handleUrlChange(e) {
    const urltext = e.target.value;
    const valid = !urltext || urltext.startsWith("http://") || urltext.startsWith("https://");
    this.setState({ url: urltext, urlInvalid: !valid})
  }

  render() {
    return (
    <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
      <Form.Group as={Row}>
      <Col>
      <InputGroup>
        <Form.Control type="text" placeholder="Player 1 Name" required value={this.state.userA} onChange={e => this.setState({ userA: e.target.value})}/>
        <Form.Control.Feedback type="invalid">
          Please provide a player name.
        </Form.Control.Feedback>
        <Form.Control.Feedback>
          Looks good!
        </Form.Control.Feedback>
      </InputGroup>
      </Col>
      <Col>
        <Form.Label>vs.</Form.Label>
      </Col>
      <Col>
      <Form.Group>
        <Form.Control type="text" placeholder="Player 2 Name" required value={this.state.userB} onChange={e => this.setState({ userB: e.target.value})}/>
        <Form.Control.Feedback type="invalid">
          Please provide a player name.
        </Form.Control.Feedback>
        <Form.Control.Feedback>
          Looks good!
        </Form.Control.Feedback>
      </Form.Group>
      </Col>
      </Form.Group>
      <Form.Group>
        <Form.Label>URL:</Form.Label>
        <Form.Control type="text" placeholder="optional" value={this.state.url} isInvalid={this.state.urlInvalid} onChange={this.handleUrlChange}/>
        <Form.Text muted>URL must start with http:// or https://</Form.Text>
        <Form.Control.Feedback type="invalid">
          Must start with http:// or https://
        </Form.Control.Feedback>
        <Form.Control.Feedback>
          Looks good!
        </Form.Control.Feedback>
      </Form.Group>
      <Button variant="primary" type="submit">Add Game</Button>
    </Form>
    );
  }
}

export default withRouter(AddGame);
