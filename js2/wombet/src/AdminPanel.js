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
    this.state = { isLoading: false, gameid: null, gameinfo: null, formgameid: null, error: null} ;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ isLoading: true });
    //TODO
  }

  render() {
    const { isLoading, gameid, gameinfo, error, formgameid } = this.state;
    if (isLoading) {
      return <Spinner animation="border" variant="primary" />;
    }

    let error_alert;
    if (error) {
      error_alert = <Alert variant="danger" onClose={() => this.setState({ error: null })} dismissible>{error}</Alert>;
    }

    if (!gameid) {
      return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        <Form.Row className="align-items-center">
        <Col xs="auto">
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="admin-key1" value={formgameid} onChange={e => this.setState({ formgameid: e.target.value})}>Admin Key</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              placeholder="Enter here"
              aria-label="Game Admin Key"
              aria-describedby="admin-key1"
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
