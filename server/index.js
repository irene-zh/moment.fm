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

app.get('/example', routes.getExample);

app.get('/saddestOf2020', routes.getSaddest2020);

app.get('/artist/:id', routes.getArtist);

app.get('/song/:id', routes.getSong);

app.get('/explore/songs/:name', routes.searchSongs);

app.get('/explore/artists/:name', routes.searchArtists);

// app.get('/iGotAFeeling/', routes.getIGotAFeeling);

// app.get('/hiphop2018', routes.getHipHop2018);

// app.get('/metal2005', routes.getMetal2005);

// app.get('/popular2020', routes.getSongsPopular2020);

// app.get('/frequency2019', routes.getArtistsFrequent2019);

// app.get('/activePop', routes.getArtistsActivePop);

// app.get('/artistRelevance', routes.getArtistsRelevance);

app.get('/login/user/:username', routes.getUser);

app.get('/login/email/:email', routes.getEmail);

app.get('/login/:username/:email/password', routes.getPassword);

app.get('/user/:username/friends', routes.getFriends);

app.get('/signup/:name/:username/:email/:password', routes.addUser);

app.listen(8081, () => {
	console.log('Server listening on PORT 8081');
});