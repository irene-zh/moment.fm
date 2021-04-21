import React from 'react';
import PageNavbar from './PageNavbar';
import BestMoviesRow from './BestMoviesRow';
import '../style/BestMovies.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BestMovies extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedDecade: "",
			selectedGenre: "",
			decades: [],
			genres: [],
			movies: []
		};

		this.submitDecadeGenre = this.submitDecadeGenre.bind(this);
		this.handleDecadeChange = this.handleDecadeChange.bind(this);
		this.handleGenreChange = this.handleGenreChange.bind(this);
	};

	/* ---- Q3a (Best Movies) ---- */
	componentDidMount() {
		/* fetch earliest year + latest year */
    fetch("http://localhost:8081/decades", {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(decadesList => {
      if (!decadesList) return;

      const first_yr = Math.round(decadesList[0].year / 10) * 10;
      const last_yr = Math.round(decadesList[1].year / 10) * 10;

      var decadesDivs = [];
      for (var y = first_yr; y < last_yr; y+=10) {
        var i = (y - first_yr) / 10;
        decadesDivs[i] = <option className="decadesOption" value={y}>{y}</option>;
      }

      this.setState({
        decades: decadesDivs,
        selectedDecade: first_yr
      });
    }, err => {
      console.log(err);
    });

    /* fetch complete list of movie genres */
    fetch("http://localhost:8081/genres", {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(genresList => {
      if (!genresList) return;

      const genresDivs = genresList.map((genreObj, i) => 
        <option className="genresOption" value={genreObj.name}>{genreObj.name}</option>
      );

      this.setState({
        genres: genresDivs,
        selectedGenre: genresList[0].name
      });
    }, err => {
      console.log(err);
    });
	};

	/* ---- Q3a (Best Movies) ---- */
	handleDecadeChange(e) {
		this.setState({
      selectedDecade: e.target.value
    });
	};

	handleGenreChange(e) {
		this.setState({
			selectedGenre: e.target.value
		});
	};

	/* ---- Q3b (Best Movies) ---- */
	submitDecadeGenre() {
		const decade = this.state.selectedDecade;
    const genre = this.state.selectedGenre;
    fetch("http://localhost:8081/bestmovies/" + decade + "/" + genre, {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(moviesList => {
      if (!moviesList) return;
      console.log(moviesList)

      const moviesDivs = moviesList.map((movieObj, i) =>
        <BestMoviesRow
          title={movieObj.title}
          id={movieObj.movie_id}
          rating={movieObj.rating}
        />
      );

      this.setState({
        movies: moviesDivs
      });
    }, err => {

    })
	};

	render() {
		return (
			<div className="BestMovies">
				
				<PageNavbar active="bestgenres" />

				<div className="container bestmovies-container">
					<div className="jumbotron">
						<div className="h5">Best Movies</div>
						<div className="dropdown-container">
							<select value={this.state.selectedDecade} onChange={this.handleDecadeChange} className="dropdown" id="decadesDropdown">
								{this.state.decades}
							</select>
							<select value={this.state.selectedGenre} onChange={this.handleGenreChange} className="dropdown" id="genresDropdown">
								{this.state.genres}
							</select>
							<button className="submit-btn" id="submitBtn" onClick={this.submitDecadeGenre}>Submit</button>
						</div>
					</div>
					<div className="jumbotron">
						<div className="movies-container">
							<div className="movie">
			          <div className="header"><strong>Title</strong></div>
			          <div className="header"><strong>Movie ID</strong></div>
								<div className="header"><strong>Rating</strong></div>
			        </div>
			        <div className="movies-container" id="results">
			          {this.state.movies}
			        </div>
			      </div>
			    </div>
			  </div>
			</div>
		);
	};
};
