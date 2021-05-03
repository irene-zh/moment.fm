import React from 'react';
import Container from 'react-bootstrap/Container';
import PageNavbar from './PageNavbar';
import NowPlaying from './NowPlaying';
import Button from 'react-bootstrap/Button';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

export default class Profile extends React.Component {
	constructor(props) {
		super(props);
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
	};

	componentDidMount() {
    // TODO FIX THIS :(( make button go away if already logged in
    if (!this.state.loggedIn) {
      this.setState({
      profileDiv: 
        <Container>
          <a href="http://localhost:8888">
            <Button>
              Login to Spotify!
            </Button>
          </a>
        </Container>});
      console.log("set login prompt button");
    }
	};

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
              artist: response.item.artists[0],
              album: response.item.album.name,
              albumArt: response.item.album.images[0].url
          }
        });
      })
    console.log(this.state);
  }

  setNowPlaying() {
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    var loggedIn = token ? true : false;

    if (loggedIn) {
      this.getNowPlaying();
      console.log(this.state);
      this.setState({
      profileDiv: 
        <Container>
          <NowPlaying
            name={this.state.name}
            artist={this.state.artist}
            album={this.state.album}
            albumArt={this.state.albumArt}
          /> 
        </Container>,
      loggedIn: true});
    }
  }

	render() {
    this.setNowPlaying();
    return (
      <>
      <PageNavbar activeKey="profile" />
      {this.state.profileDiv}
      </>
    );
	};
};
