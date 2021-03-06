
import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default class SpotifySongRow extends React.Component {
  render() {
    return (
      <Container>
        <Row> 
          <Col md="auto"><img src={this.props.albumArt} alt={this.props.album} height="50px"/></Col>
          <Col xs={4}><p>{this.props.name}</p></Col>
          <Col><p>{this.props.artist}</p></Col>
          <Col><p>{this.props.album}</p></Col>
        </Row>
      </Container>
		);
	};
};
