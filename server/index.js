const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

app.get('/artist/:artistId', routes.getArtist);

app.get('/song/:songId', routes.getSong);

app.get('/explore/songs/:title', routes.searchSongs);

app.get('/explore/artists/:name', routes.searchArtists);

app.get('/related/artists/:name', routes.getRecommendedArtists);

app.get('/iGotAFeeling/', routes.getIGotAFeeling);

app.get('/saddestOf2020', routes.getSaddest2020);

app.get('/hiphop2018', routes.getHipHop2018);

app.get('/metal2005', routes.getMetal2005);

app.get('/popular2020', routes.getSongsPopular2020);

app.get('/frequency2019', routes.getArtistsFrequent2019);

app.get('/activePop', routes.getArtistsActivePop);

app.get('/artistRelevance', routes.getArtistsRelevance);

app.get('/login/:username', routes.getPassword);

app.get('/users/:username/friends', routes.getFriends);

app.listen(8081, () => {
	console.log('Server listening on PORT 8081');
});