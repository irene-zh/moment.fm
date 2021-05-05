import React from 'react';
import PageNavbar from './PageNavbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Media from 'react-bootstrap/Media';
import Button from 'react-bootstrap/Button';

export default class SongPage extends React.Component {
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
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/song/:id",
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(songInfo => {
      if (!songInfo) return;

      const songDiv = 
        <Container>
          <Row>
            <h1>{songInfo.name}</h1>
            <p>{songInfo.artist}</p>
            <p>{songInfo.year}</p>
          </Row>
        </Container>;

      // Set the state of the keywords list to the value returned by the HTTP response from the server.
      this.setState({
        info: songDiv
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
