import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default class ArtistRow extends React.Component {
	render() {
		return (
			<Container>
        <Row>
          <Col><p>{this.props.name}</p></Col>
        </Row>
      </Container>
		);
	};
};
