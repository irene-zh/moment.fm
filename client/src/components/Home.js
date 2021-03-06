import React from 'react';
import SongRow from './SongRow';
import ArtistRow from './ArtistRow';
import Container from 'react-bootstrap/Container'
import CardColumns from 'react-bootstrap/CardColumns'
import Card from 'react-bootstrap/Card'

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

  async getSongsIGotAFeeling() {
    var resultsDiv;
		await fetch("http://localhost:8081/iGotAFeeling", {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(resList => {
      if (!resList) return;

      resultsDiv = resList.rows.map((resObj, i) =>
        <SongRow          
          id={resObj[0]}
          name={resObj[1]}
          artist={resObj[2]}
          artist_id={resObj[4]}
          year={resObj[3]}
        />
      );
    }, err => {
      console.log(err);
    });

    const contents = (
      <Card>
        <Card.Body>
          <Card.Title>We know you love "I Gotta Feeling"</Card.Title>
          <Card.Subtitle>so here's some songs just like it</Card.Subtitle>
          {resultsDiv}
        </Card.Body>
      </Card>
    );

    this.setState({
      iGotAFeeling: contents
    });
  }

  async getSongsSaddest2020() {
    var resultsDiv; 
		await fetch("http://localhost:8081/saddestOf2020", {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(resList => {
      if (!resList) return;
      resultsDiv = resList.rows.map((resObj, i) =>
        <SongRow
          id={resObj[0]}
          name={resObj[1]}
          artist={resObj[2]}
          artist_id={resObj[3]}
          year={'2020'}
        />
      );
    }, err => {
      console.log(err);
    });

    const contents = (
      <Card>
        <Card.Body>
          <Card.Title>Saddest songs of 2020</Card.Title>
          <Card.Subtitle>bc last yr sucked</Card.Subtitle>
          {resultsDiv}
        </Card.Body>
      </Card>
    );

    this.setState({
      saddest2020: contents
    });
  }

  async getSongsHipHop2018() {
    var resultsDiv;
    var artist = "";
		await fetch("http://localhost:8081/hiphop2018", {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(resList => {
      if (!resList) return;

      artist = resList.rows[0][2];
      resultsDiv = resList.rows.map((resObj, i) =>
        <SongRow
          id={resObj[1]}
          name={resObj[0]}
          artist={resObj[2]}
          artist_id={resObj[4]}
          year={resObj[3]}
        />
      );
    }, err => {
      console.log(err);
    });

    console.log(resultsDiv);

    const contents = (
      <Card>
        <Card.Body>
          <Card.Title>Best of hiphop by {artist}, the biggest hiphop artist of 2018</Card.Title>
          <Card.Subtitle>swag</Card.Subtitle>
          {resultsDiv}
        </Card.Body>
      </Card>
    );

    this.setState({
      hiphop2018: contents
    });
  }

  async getSongsMetal2005() {
    var resultsDiv;
		await fetch("http://localhost:8081/metal2005", {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(resList => {
      if (!resList) return;

      resultsDiv = resList.rows.map((resObj, i) =>
        <SongRow
          id={resObj[1]}
          name={resObj[0]}
          artist={resObj[2]}
          artist_id={resObj[4]}
          year={resObj[3]}
        />
      );
    }, err => {
      console.log(err);
    });

    const contents = (
      <Card>
        <Card.Body>
          <Card.Title>Liveliest metal in 2005</Card.Title>
          <Card.Subtitle>yeah</Card.Subtitle>
          {resultsDiv}
        </Card.Body>
      </Card>
    );

    this.setState({
      metal2005: contents
    });

  }

  async getSongsPopular2020() {
    var resultsDiv; 
		await fetch("http://localhost:8081/popular2020", {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(resList => {
      if (!resList) return;

      resultsDiv = resList.rows.map((resObj, i) =>
        <SongRow
          id={resObj[1]}
          name={resObj[0]}
          artist={resObj[2]}
          artist_id={resObj[4]}
          year={resObj[3]}
        />
      );
    }, err => {
      console.log(err);
    });

    const contents = (
      <Card>
        <Card.Body>
          <Card.Title>Top songs in 2020 by 2019's top artists</Card.Title>
          <Card.Subtitle>bc clearly they've still got it</Card.Subtitle>
          {resultsDiv}
        </Card.Body>
      </Card>
    );

    this.setState({
      popular2020: contents
    });
  }

  async getArtistsFrequent2019() {
    var resultsDiv; 
		await fetch("http://localhost:8081/frequency2019", {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(resList => {
      if (!resList) return;

      resultsDiv = resList.rows.map((artist, i) =>
        <ArtistRow
          name = {artist[0]}
          id={artist[1]}
          key={artist[1]}
        />
      );
    }, err => {
      console.log(err);
    });

    const contents = (
      <Card>
        <Card.Body>
          <Card.Title>Most active artists of 2019</Card.Title>
          <Card.Subtitle>they released a lot of songs :0</Card.Subtitle>
          {resultsDiv}
        </Card.Body>
      </Card>
    );

    this.setState({
      frequent2009: contents
    });
  }

  async getArtistsActivePop() {
    var resultsDiv; 
		await fetch("http://localhost:8081/activePop", {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(resList => {
      if (!resList) return;

      resultsDiv = resList.rows.map((artist, i) =>
        <ArtistRow
          name = {artist[0]}
          id={artist[1]}
          key={artist[1]}
        />
      );
    }, err => {
      console.log(err);
    });

    const contents = (
      <Card>
        <Card.Body>
          <Card.Title>Most prolific pop artists of all time</Card.Title>
          <Card.Subtitle>they are really popular!!</Card.Subtitle>
          {resultsDiv}
        </Card.Body>
      </Card>
    );

    this.setState({
      activePopArtist: contents
    });

  }

  async getArtistsRelevance() {
    var resultsDiv; 
		await fetch("http://localhost:8081/artistsRelevance", {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(resList => {
      if (!resList) return;

      resultsDiv = resList.rows.map((artist, i) =>
        <ArtistRow
          name = {artist[0]}
          id={artist[1]}
          key={artist[1]}
        />
      );
    }, err => {
      console.log(err);
    });

    const contents = (
      <Card>
        <Card.Body>
          <Card.Title>Most relevant artists</Card.Title>
          <Card.Subtitle>o____o</Card.Subtitle>
          {resultsDiv}
        </Card.Body>
      </Card>
    );

    this.setState({
      relevance: contents
    });

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
        <CardColumns>
          {this.state.iGotAFeeling}
          {this.state.relevance}
          {this.state.activePopArtist}
          {this.state.saddest2020}
          {this.state.popular2020}
          {this.state.frequent2009}
          {this.state.hiphop2018}
          {this.state.metal2005}
        </CardColumns>
      </Container>
			</>
		);
	};
};
