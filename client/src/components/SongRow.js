import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default class SongRow extends React.Component {
	render() {
		return (
			<Container>
        <Row>
          <Col><p><a href={"/song/" + this.props.id}>{this.props.name}</a></p></Col>
          <Col><p><a href={"/artist/" + this.props.artist_id}>{this.props.artist}</a></p></Col>
          <Col><p>{this.props.year}</p></Col>
        </Row>
      </Container>
		);
	};
};
