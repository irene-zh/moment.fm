import React from 'react';
import Container from 'react-bootstrap/Container';
import ArtistRow from './ArtistRow';

export default class RelatedArtists extends React.Component {
	/* props looks like:
		{
			artistId
		}
	*/
  constructor(props) {
		super(props);

    const artistId = this.props.id;
    var artistsDiv;

    // Send an HTTP request to the server.
    fetch("http://localhost:8081/related/artists/" + artistId,
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(artistsInfo => {
      if (!artistsInfo) return;

      artistsDiv = artistsInfo.map((artist, i) =>
        <ArtistRow
          name={artist.name}
          id={artist.artist_id}
        />
      );
    }, err => {
      // Print the error if there is one.
      console.log(err);
    });

		this.state = {
			info: artistsDiv
		};
	};
	
	render() {
		return (
    <>
    <Container>
    {this.state.info}
    </Container>
    </>
    );
	};
};
