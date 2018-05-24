import React from 'react';
import MovieGridTile from './movie_grid_tile';

const MoviePicker = ({name, movies, onMoviePicked}) => {
  if (!movies) {
    return <div>No movies to pick from.</div>;
  }

  const numCols = 4;

  const movieItems = movies.map((movie) => {
    return <MovieGridTile key={movie.id} movie={movie} onMoviePicked={onMoviePicked} />
  });

  return (
    [
      <h4>Pick a movie that matches: {name}</h4>,
      <div className="movieGrid">
        {movieItems}
      </div>
    ]
  );
}

export default MoviePicker;
