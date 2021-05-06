import React from 'react';
import Container from 'react-bootstrap/Container';

export default class NowPlaying extends React.Component {
	/* props looks like:
		{
			id
			name
      artist
      album
      albumArt 
		}
	*/
	
	render() {
		return (
			<Container>
        <p>{this.props.name}</p>
        <p>{this.props.artist}</p>
        <p>{this.props.album}</p>
        <img src={this.props.albumArt} alt={this.props.album}/>
      </Container>
		);
	};
};
