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
  Form,
  Accordion,
  Card
} from 'react-bootstrap';
import Home from './Home';
import Explore from './Explore';
import PageNavbar from './PageNavbar';
import RelatedArtists from './RelatedArtists';
import NowPlaying from './NowPlaying';
import SpotifySongRow from './SpotifySongRow';
import SpotifyWebApi from 'spotify-web-api-js';
import Profile from './Profile';
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

/* functional component to render profile page for user */
function UserPage() {
  let { username } = useParams();
  const userDiv = (
    <Container>
      <Row>
      <h3>{username}</h3>
      </Row>
    </Container>
  );
  var friendsDiv, friendsList;

  fetch("http://localhost:8081/user/:" + username + "/friends",
  {
    method: 'GET' // The type of HTTP request.
  }).then(res => {
    // Convert the response data to a JSON.
    return res.json();
  }, err => {
    // Print the error if there is one.
    console.log(err);
  }).then(userInfo => {
    if (!userInfo) return;

    friendsList = userInfo.map((friend, i) =>
      <Card.Body><a href={"/user/" + friend}>{friend}</a></Card.Body>
    );

    friendsDiv = 
      <Container>
        <Accordion defaultActiveKey="0">
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                {userInfo.friend.length} Friends
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              {friendsList}
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </Container>;
  }, err => {
    // Print the error if there is one.
    console.log(err);
  });

  return (
  <>
  <PageNavbar />
  {userDiv}
  {friendsDiv}
  </>
  );
}

/* functional component to render login/signup page */
function Login(props) {
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
      <Form onSubmit={(e) => props.submitLoginForm(e)}>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control id="name" type="text" placeholder="Enter name" />
          <Form.Text className="text-muted">
            what's your name!!?
          </Form.Text>
        </Form.Group>

        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control id="username" type="text" placeholder="Enter username" />
          <Form.Text className="text-muted">
            choose a unique username
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control id="email" type="email" placeholder="Enter email" />
          <Form.Text className="text-muted">
            to set up your account!
          </Form.Text>
        </Form.Group>
  
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control id="password" type="password" placeholder="Password" />
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
    console.log("submitting!");
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    var name = document.getElementById('name').value;
    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    if (!name || !username || !email || !password) {
      return;
    }
    console.log(name, username, email, password);

    var userExists = false; 
    var emailExists = false;
    // check if user with this username exists
    fetch("http://localhost:8081/login/user/:" + username, {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(res => {
      if (!res) return;
      userExists = (res.cnt > 0);
      console.log(userExists);
    }, err => {
      console.log(err);
    });
    // check if user with this email exists
    fetch("http://localhost:8081/login/email/:" + email, {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(res => {
      if (!res) return;
      userExists = (res.cnt > 0);
      console.log(emailExists);
    }, err => {
      console.log(err);
    });

    if (userExists || emailExists) {
      // successful login if passwords match for input username
      fetch("http://localhost:8081/login/:" + username + ":/" + email + "/password", {
        method: 'GET'
      }).then(res => {
        return res.json();
      }, err => {
        console.log(err);
      }).then(res => {
        if (!res) return;
        if (res.password === password) {
          this.setState({loggedIn: true, 
                         username: username,
                         email: email});
          return;
        }
      }, err => {
        console.log(err);
      });
    }

    if (!userExists && !emailExists) {
      fetch("http://localhost:8081/signup/:" + name + ":/" + username + ":/" + email + "/:" + password, {
        method: 'GET'
      }, err => {
        console.log(err);
      })
      console.log("user created!");
      this.setState({loggedIn: true, 
                     username: username,
                     email: email});
      return;
    }

    return;
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
                      or head on over to the <a href="/Login">Login</a> page to make an account!
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
						<Route exact path="/Login"
              render={() =>
              <Login 
                loggedIn={this.state.loggedIn} 
                submitLoginForm={this.submitLoginForm.bind(this)} 
                username={this.state.username}
              />}
            />
            <Route exact path="/Profile"
              render={() => (
                <>
                <PageNavbar />
                <Profile 
                  loggedIn={this.state.loggedIn} 
                  username={this.state.username} 
                />
                </>)}
            />
            <Route path="/artist/:artistId">
              <ArtistPage />
            </Route>
            <Route path="/song/:songId">
              <SongPage />
            </Route>
            <Route path="/user/:username">
              <UserPage />
            </Route>
					</Switch>
				</Router>
			</div>
		);
	};
};