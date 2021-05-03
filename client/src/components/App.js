import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Explore from './Explore';
import Profile from './Profile';
import ArtistPage from './ArtistPage';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

export default class App extends React.Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loginPrompt: [],
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
							exact
							path="/"
							render={() => <Explore />}
						/>
						<Route
							exact
							path="/Explore"
							render={() => <Explore />}
						/>
						<Route
							exact
							path="/Profile"
							render={() => <Profile />}
						/>
            <Route 
              exact
              path="/artist/:id"
              component={ArtistPage}
            />
					</Switch>
				</Router>
			</div>
		);
	};
};