import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default class SongRow extends React.Component {
	render() {
		return (
			<Container>
        <Row>
          <Col><p>{this.props.name}</p></Col>
          <Col><p>{this.props.artist}</p></Col>
          <Col><p>{this.props.year}</p></Col>
        </Row>
      </Container>
		);
	};
};
