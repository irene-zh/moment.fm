import React from 'react';
import PageNavbar from './PageNavbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Media from 'react-bootstrap/Media';
import Button from 'react-bootstrap/Button';

export default class ArtistPage extends React.Component {
	/* props looks like:
		{
			id
		}
	*/
  constructor(props) {
		super(props);

		this.state = {
			info: {}
		};
	};

  componentDidMount() {
    const artistId = '';

    // Send an HTTP request to the server.
    fetch("http://localhost:8081/artist/:" + artistId,
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(artistInfo => {
      if (!artistInfo) return;

      // TODO: LINK FOR GENRES
      const genresDiv = artistInfo.genres.map((genre, i) =>
        <a href=""><Button/>{genre}</a>
      ); 

      const artistDiv = 
        <Container>
          <Row>
            <Media>
              <img src={artistInfo.img} width={30} />
              <Media.Body>
                <h1>{artistInfo.name}</h1>
              </Media.Body>
            </Media>
          </Row>
          <Row>
            {genresDiv}
          </Row>
        </Container>;

      // Set the state of the keywords list to the value returned by the HTTP response from the server.
      this.setState({
        info: artistDiv
      });
    }, err => {
      // Print the error if there is one.
      console.log(err);
    });
  }
	
	render() {
		return (
    <>
    <PageNavbar />
    {this.state.info}
    </>
    );
	};
};
