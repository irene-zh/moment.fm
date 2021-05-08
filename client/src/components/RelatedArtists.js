import React from 'react';
import Container from 'react-bootstrap/Container';
import ArtistRow from './ArtistRow';

export default class RelatedArtists extends React.Component {
	/* props looks like:
		{
			id
      name
		}
	*/
  constructor(props) {
		super(props);

		this.state = {
			info: {}
		};
	};

  componentDidMount() {
    const artistId = this.props.artistId;

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

      const artistsDiv = artistsInfo.map((artist, i) =>
        <ArtistRow
          name={artist.name}
          id={artist.id}
        />
      );

      // Set the state of the keywords list to the value returned by the HTTP response from the server.
      this.setState({
        info: artistsDiv
      });
    }, err => {
      // Print the error if there is one.
      console.log(err);
    });
  }
	
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
