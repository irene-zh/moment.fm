import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default class NowPlaying extends React.Component {
	/* props looks like:
		{
			name
      artist
      album
      albumArt 
		}
	*/
	
	render() {
		return (
			<Container style={{marginTop:"30px", marginBottom:"30px"}}>
        <Row>          
          <Col md="auto"><img src={this.props.albumArt} alt={this.props.album} height="50px"/></Col>
          <Col xs={5}><p>{this.props.name}</p></Col>
          <Col><p>{this.props.artist}</p></Col>
          <Col><p>{this.props.album}</p></Col>
        </Row>
      </Container>
		);
	};
};
