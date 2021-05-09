import React from 'react';
import PageNavbar from './PageNavbar';
import SongRow from './SongRow';
import ArtistRow from './ArtistRow';
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
//import Dropdown from 'react-bootstrap/Dropdown'

export default class Explore extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			searchItem: '',
			results: []
		};

		this.handleInputChange = this.handleInputChange.bind(this);
		this.submitSong = this.submitSong.bind(this);
		this.submitArtist = this.submitArtist.bind(this);
	};

	handleInputChange(e) {
		this.setState({
			searchItem: e.target.value
		});
	};

  submitSong() {
    const searchItem = this.state.searchItem;
    console.log("searching for song with title " + searchItem);
    const header = (
    <Container>
      <Row>
        <Col><h5>Song Title</h5></Col>
        <Col><h5>Artist</h5></Col>
        <Col><h5>Release Year</h5></Col>
      </Row>
    </Container>
    );
		fetch("http://localhost:8081/explore/songs/" + searchItem, {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(resList => {
      if (!resList) return;

      const resultsDiv = resList.rows.map((resObj, i) =>
        <SongRow
          name={resObj[0]}
          artist={resObj[1]}
          artist_id={resObj[4]}
          id={resObj[2]}
          year={resObj[3]}
        />
      );

      this.setState({
        results: [header, resultsDiv]
      });
    }, err => {
      console.log(err);
    });
  }

	submitArtist() {
    const searchItem = this.state.searchItem;
    console.log("searching for artist with title " + searchItem);
    const header = (
    <Container>
      <Row>
        <Col><h5>Name</h5></Col>
      </Row>
    </Container>
    );
		fetch("http://localhost:8081/explore/artists/" + searchItem, {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(resList => {
      if (!resList) return;

      const resultsDiv = resList.rows.map((resObj, i) =>
        <ArtistRow
          name={resObj[0]}
          id={resObj[1]}
        />
      );

      this.setState({
        results: [header, resultsDiv]
      });
    }, err => {
      console.log(err);
    });
	};

	
	render() {
		return (
			<>
				<PageNavbar active="explore" />
        <Container>
          <h1>&#x1F440;</h1>
          <h1>Explore</h1>
          <Row>
            <Col sm={8}><input type="text" style={{width:"90%"}} placeholder="search for an artist or song!" value={this.state.searchItem} onChange={this.handleInputChange} /></Col>
            <Col sm={2}><Button onClick={this.submitArtist}>Search Artists</Button></Col>
            <Col sm={2}><Button onClick={this.submitSong}>Search Songs</Button></Col>
          </Row>
        </Container>
        {this.state.results}
			</>
		);
	};
};
