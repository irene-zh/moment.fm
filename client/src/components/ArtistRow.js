import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default class ArtistRow extends React.Component {
	render() {
		return (
			<Container>
        <Row>
          <Col><p><a href={"/artist/" + this.props.id}>{this.props.name}</a></p></Col>
        </Row>
      </Container>
		);
	};
};
