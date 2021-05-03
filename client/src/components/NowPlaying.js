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
      </Container>
		);
	};
};
