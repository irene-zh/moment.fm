import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch,
  useParams
} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Home from './Home';
import Explore from './Explore';
import PageNavbar from './PageNavbar';
import RelatedArtists from './RelatedArtists';
import NowPlaying from './NowPlaying';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

function SongPage() {
  let { songId } = useParams();
  var songDiv;

  // Send an HTTP request to the server.
  fetch("http://localhost:8081/song/:" + songId,
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

    songDiv = 
      <Container>
        <Row>
          <h1>{songInfo.name}</h1>
          <p>{songInfo.artist}</p>
          <p>{songInfo.year}</p>
        </Row>
      </Container>;
  }, err => {
    // Print the error if there is one.
    console.log(err);
  });

  return (
  <>
  <PageNavbar />
  {songDiv}
  </>
  );
}

function ArtistPage() {
  let { artistId } = useParams();
  var artistDiv;

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
      <a href="#"><Button/>{genre}</a>
    ); 

    artistDiv = 
      <Container>
        <Row>
          <h1>{artistInfo.name}</h1>
        </Row>
        <Row>
          {genresDiv}
        </Row>
        <Row>
          <RelatedArtists artistId={artistId} />
        </Row>
      </Container>;
  }, err => {
    // Print the error if there is one.
    console.log(err);
  });

  return (
  <>
  <PageNavbar />
  {artistDiv}
  </>
  );
}

export default class App extends React.Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      profileDiv: [],
      loggedIn: token ? true : false,
      nowPlaying: {
        name: '', 
        artist: '',
        album: '', 
        albumArt: ''}
    }
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getNowPlaying(){
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: { 
            name: response.item.name, 
            artist: response.item.artists[0].name,
            album: response.item.album.name, 
            albumArt: response.item.album.images[0].url
          }
        });
      })
  }

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
							exact path="/"
							render={() => (
                <>
                <PageNavbar />
                <Container style={{marginBottom:"50px"}}>
                  <h1>&#x1F3A7;</h1>
                  <h1>Welcome to moment.fm!</h1>
                  <p>a kewl way to find music recs ahaha xd be in the ~ moment ~</p>
                  <p>Check out the <a href="/Explore">Explore</a> page to start searching for your favorite artists and songs, 
                      or head on over to the <a href="/Profile">Profile</a> page to connect your Spotify and unlock more hidden gems!
                  </p>
                  <p>In the meantime, we've got some fun recommendations and statistics for you below.</p>
                </Container>
                <Container>
                {!this.state.loggedIn && 
                  <a href="http://localhost:8888">
                  <Button>
                    Login to Spotify!
                  </Button>
                  </a>}
                {this.state.loggedIn && 
                <Button onClick={this.getNowPlaying()}>
                  Check my now playing!
                </Button>}
                <NowPlaying 
                  name={this.state.nowPlaying.name} 
                  artist={this.state.nowPlaying.artist}
                  album={this.state.nowPlaying.album}
                  albumArt={this.state.nowPlaying.albumArt}/>
                </Container>
                <Home/>
                </>
              )}
						/>
						<Route
							exact path="/Explore"
							render={() => <Explore />}
						/>
						<Route
							exact path="/Profile"
							render={() => (
                <>
                <PageNavbar />
                <Container>
                {!this.state.loggedIn && 
                  <a href="http://localhost:8888">
                  <Button>
                    Login to Spotify!
                  </Button>
                  </a>}
                {this.state.loggedIn && 
                <Button onClick={this.getNowPlaying()}>
                  Check my now playing!
                </Button>}
                <NowPlaying 
                  name={this.state.nowPlaying.name} 
                  artist={this.state.nowPlaying.artist}
                  album={this.state.nowPlaying.album}
                  albumArt={this.state.nowPlaying.albumArt}/>
                </Container>
                </>
              )}
						/>
            <Route path="/artist/:artistId">
              <ArtistPage />
            </Route>
            <Route path="/song/:songId">
              <SongPage />
            </Route>
					</Switch>
				</Router>
			</div>
		);
	};
};