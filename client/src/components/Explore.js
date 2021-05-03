import React from 'react';
import PageNavbar from './PageNavbar';
import RecommendationsRow from './RecommendationsRow';
import '../style/Recommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Recommendations extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the selected movie name, and the list of recommended movies.
		this.state = {
			movieName: "",
			recMovies: []
		};

		this.handleMovieNameChange = this.handleMovieNameChange.bind(this);
		this.submitMovie = this.submitMovie.bind(this);
	};

	handleMovieNameChange(e) {
		this.setState({
			movieName: e.target.value
		});
	};

	/* ---- Q2 (Recommendations) ---- */
	// Hint: Name of movie submitted is contained in `this.state.movieName`.
	submitMovie() {
    const movie = this.state.movieName;
		fetch("http://localhost:8081/recommendations/" + movie, {
      method: 'GET'
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(recsList => {
      if (!recsList) return;

      const recsDivs = recsList.map((recObj, i) =>
        <RecommendationsRow
          title={recObj.title}
          id={recObj.movie_id}
          rating={recObj.rating}
          votes={recObj.num_ratings}
        />
      );

      this.setState({
        recMovies: recsDivs
      });
    }, err => {
      console.log(err);
    });
	};

	
	render() {
		return (
			<div className="Explore">
				<PageNavbar active="explore" />
        
			</div>
		);
	};
};
