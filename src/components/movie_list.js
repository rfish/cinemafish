import React from 'react';
import MovieTile from './movie_tile';

const MovieList = ({movies}) => {
  const movieItems = movies.map((movie) => {
    return <MovieTile movie={movie} />
  });

  return (
    <ul className="col-md-4 list-group">
      {movieItems}
    </ul>
  );
}

export default MovieList;
