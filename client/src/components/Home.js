import React from 'react';
import PageNavbar from './PageNavbar';
import SongRow from './SongRow';
import ArtistRow from './ArtistRow';
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import CardDeck from 'react-bootstrap/CardDeck'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'

export default class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			iGotAFeeling: '',
      saddest2020: '',
      hiphop2018: '',
      metal2005: '',
      frequent2009: '',
      popular2020: '',
      activePopArtist: '',
      relevance: ''
		};

		this.getSongsIGotAFeeling = this.getSongsIGotAFeeling.bind(this);
		this.getSongsSaddest2020 = this.getSongsSaddest2020.bind(this);
		this.getSongsHipHop2018 = this.getSongsHipHop2018.bind(this);
		this.getSongsMetal2005 = this.getSongsMetal2005.bind(this);
		this.getSongsPopular2020 = this.getSongsPopular2020.bind(this);
		this.getArtistsFrequent2019 = this.getArtistsFrequent2019.bind(this);
		this.getArtistsActivePop = this.getArtistsActivePop.bind(this);
		this.getArtistsRelevance = this.getArtistsRelevance.bind(this);
	};

  getSongsIGotAFeeling() {
    const header = (
      <Card>
        <Card.Body>
          <Card.Title>Songs most like <b>I got a Feeling</b></Card.Title>
          <SongRow title="hola" artist="linder" year="2021"/>
        </Card.Body>
      </Card>
    );
    this.setState({iGotAFeeling: header});
/*
		fetch("http://localhost:8081/iGotAFeeling", {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(resList => {
      if (!resList) return;

      const resultsDiv = resList.map((resObj, i) =>
        <SongRow
          title={resObj.title}
          artist={resObj.artist}
          year={resObj.year}
        />
      );

      this.setState({
        iGotAFeeling: [header, resultsDiv]
      });
    }, err => {
      console.log(err);
    });*/
  }

  getSongsSaddest2020() {
    const header = (
      <Card>
        <Card.Body>
          <Card.Title>Saddest songs of <b>2020</b></Card.Title>
          <Card.Text>bc that year fckin sucked</Card.Text>
          <SongRow title="hola" artist="linder" year="2021"/>
        </Card.Body>
      </Card>
    );
    this.setState({saddest2020: header});
  }

  getSongsHipHop2018() {

  }

  getSongsMetal2005() {

  }

  getSongsPopular2020() {

  }

  getArtistsFrequent2019() {

  }

  getArtistsActivePop() {

  }

  getArtistsRelevance() {

  }
  
  componentDidMount() {
    this.getSongsIGotAFeeling();
    this.getSongsSaddest2020();
    this.getSongsHipHop2018();
    this.getSongsMetal2005();
    this.getSongsPopular2020();
    this.getArtistsFrequent2019();
    this.getArtistsActivePop();
    this.getArtistsRelevance();
  }
	
	render() {
		return (
			<>
      <Container>
        <CardDeck>
          {this.state.iGotAFeeling}
          {this.state.saddest2020}
        </CardDeck>
      </Container>
			</>
		);
	};
};
