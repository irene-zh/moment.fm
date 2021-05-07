import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch,
  useParams
} from 'react-router-dom';
import {
  Container,
  Row,
  Button,
  Form
} from 'react-bootstrap';
import Home from './Home';
import Explore from './Explore';
import PageNavbar from './PageNavbar';
import RelatedArtists from './RelatedArtists';
import NowPlaying from './NowPlaying';
import SpotifySongRow from './SpotifySongRow';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

/* functional component to render page for song */
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

/* functional component to render page for artist */
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

/* functional component to render profile / login page */
function Profile(props) {
  var outdiv;
  if (props.loggedIn) {
    outdiv = (
      <>
      <PageNavbar />
      <Container>
      Welcome {props.username}!
      </Container>
      </>
    );
  } else {
    outdiv = (
      <>
      <PageNavbar />
      <Container>
      <Form onSubmit={props.submitLoginForm}>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Enter username" />
          <Form.Text className="text-muted">
            choose a unique username
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
          <Form.Text className="text-muted">
            to set up your account!
          </Form.Text>
        </Form.Group>
  
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Button type="submit">
          Let's go!
        </Button>
      </Form>
      </Container>
      </>
    );
  }

  return outdiv;
}

/* main app */
export default class App extends React.Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      email: '',
      username: '',
      loggedIn: false,
      spotifyLoggedIn: token ? true : false,
      recentTracks: [],
      nowPlaying: {
        name: '', 
        artist: '',
        album: '', 
        albumArt: ''}
    }

    this.getHashParams = this.getHashParams.bind(this);
    this.getNowPlaying = this.getNowPlaying.bind(this);
    this.getRecentTracks = this.getRecentTracks.bind(this);
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
      }, err => {
        console.log(err)
      });
  }

  getRecentTracks() {
    spotifyApi.getMyRecentlyPlayedTracks()
      .then((response) => {
        response.json();
      }, err => {
        console.log(err);
      }).then(recentTracks => {
        if (!recentTracks) return;

        const tracksDiv = recentTracks.map((song, i) => {
          <SpotifySongRow 
            name={song.item[i].name}
            artist={song.item[i].artist[0].name}
            album={song.item[i].album.name}
            albumArt={song.item[i].album.images[0].url}
          />
        });

        this.setState({recentTracks: tracksDiv});
      }, err => {
        console.log(err);
      });
  }

  submitLoginForm(event) {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    console.log("submitting!");
    console.log(event);
    console.log(event.target.value);

    this.setState({loggedIn: true});
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
                {!this.state.spotifyLoggedIn && 
                  <a href="http://localhost:8888">
                  <Button>
                    Login to Spotify!
                  </Button>
                  </a>}
                {this.state.spotifyLoggedIn && 
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
						<Route exact path="/Profile">
              <Profile 
                loggedIn={this.state.loggedIn} 
                submitLoginForm={this.submitLoginForm.bind(this)} 
                username={this.state.username} />
            </Route>
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