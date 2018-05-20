import React from 'react';
import MovieGridTile from './movie_grid_tile';

const MovieGrid = ({movies}) => {
  if (!movies) {
    return <div>Loading movie list</div>;
  }

  const numCols = 3;

  const movieItems = movies.map((movie) => {
    return <MovieGridTile movie={movie} />
  });

  return (
    <div className="movieGrid">
      {movieItems}
    </div>
  );
}

export default MovieGrid;
