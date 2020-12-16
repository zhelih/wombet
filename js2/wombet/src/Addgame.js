import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { API } from './Api';

class AddGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = { validated: false, userA: null, userB: null, url: null, urlInvalid: false, key: null, tms: null, tm: null } ;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUrlChange = this.handleUrlChange.bind(this);
    this.handleTmSelection = this.handleTmSelection.bind(this);
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
      if (this.state.tm) {
        api_string = api_string + '&tm=' + encodeURIComponent(this.state.tm);
      }
      await fetch(api_string)
      .then(response => {
        if (response.ok) {
          return response.json();
         } else {
          throw new Error('Failed to fetch');
        }
      })
      .then(response => {
        this.setState({ key: response.key })
      })
      .catch(error => console.log(error));
      //this.props.history.push("/");
    } else {
      this.setState({ validated: true });
    }
  }

  componentDidMount() {
    let query = API + '/tournaments';
    fetch(query)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to fetch');
      }
    })
    .then(json_data => this.setState({ tms: json_data }))
    .catch(error => console.log(error));
  }

  handleUrlChange(e) {
    const urltext = e.target.value;
    const valid = !urltext || urltext.startsWith("http://") || urltext.startsWith("https://");
    this.setState({ url: urltext, urlInvalid: !valid})
  }

  handleTmSelection(eventKey, event) {
    const tm_name = this.state.tms[eventKey];
    this.setState({ tm: tm_name });
  }

  render() {
    if (this.state.key) {
     return <Alert variant="success">
       <Alert.Heading>STOP, please read below!</Alert.Heading>
        <p className="mb-0">
          Use Game Admin key <b>{this.state.key}</b> to stop voting, call results, etc. in the Admin Panel.
          Store it or Admin Access will be permanently lost!
        </p>
        <hr />
        <p>TODO link to admin panel with populated key</p>
        </Alert>;
    }

    const tms_drop = this.state.tms ? this.state.tms.map((tm, index) => <Dropdown.Item eventKey={index} onSelect={this.handleTmSelection}>{tm}</Dropdown.Item>) : <noscript />;

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
      <Col xs={2}>
        <Form.Label><p>vs</p></Form.Label>
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
      <Form.Group>
        <Form.Label>Tournament</Form.Label>
        <Form.Control type="text" placeholder="optional" value={this.state.tm} onChange={e => this.setState({ tm: e.target.value})} />
        <DropdownButton title="Choose">
          {tms_drop}
        </DropdownButton>
      </Form.Group>
      <Button variant="primary" type="submit">Add Game</Button>
    </Form>
    );
  }
}

export default withRouter(AddGame);
