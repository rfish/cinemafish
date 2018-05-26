import React, { Component } from 'react';

const MovieGridTile = ({movie, onMoviePicked}) => {
  // TODO: call the configuration path to fetch the base URLs
  const thumbnail_path = `https://image.tmdb.org/t/p/w185/${movie.poster_path}`
  const link = `https://www.themoviedb.org/movie/${movie.id}`
  console.log(thumbnail_path);

  if (onMoviePicked) {
    console.log(movie);
    return <a onClick={() => { onMoviePicked(movie); }} border="5">
      <img src={thumbnail_path} title={movie.title} />
    </a>
  } else {
    return (
      <a href={link} target="themoviedb">
        <div className="col-sm-4">
          <img src={thumbnail_path} title={movie.name} />
        </div>
      </a>
    );
  }
}

export default MovieGridTile;
