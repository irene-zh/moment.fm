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

app.get('/artist/:name', routes.getArtist);

app.get('/song/:id', routes.getSong);

app.get('/explore/songs/:title', routes.getRecommendedSongs);

app.get('/explore/artists/:artist_name', routes.getRecommendedArtists);

app.get('/iGotAFeeling/', routes.getIGotAFeeling);

app.listen(8081, () => {
	console.log('Server listening on PORT 8081');
});