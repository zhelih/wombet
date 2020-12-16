import React, { Component } from 'react';
// bootstrap imports
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

//import Spinner from 'react-bootstrap/Spinner';
import { API } from './Api';

class AdminPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: false, gamekey: null, gameinfo: null, formgamekey: null, error: null} ;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ isLoading: true });
    const key = this.state.formgamekey;
    console.log(this.state);

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
    return (
      <div>
      <h2>In progress</h2>
      </div>
    );
  }
}

export default AdminPanel;
