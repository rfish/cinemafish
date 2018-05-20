import React, { Component } from 'react';

const MovieGridTile = ({movie}) => {
  // TODO: call the configuration path to fetch the base URLs
  const thumbnail_path = `https://image.tmdb.org/t/p/w185/${movie.poster_path}`
  const link = `https://www.themoviedb.org/movie/${movie.id}`
  console.log(thumbnail_path);

  return (
    <a href={link} target="themoviedb">
      <div class="col-sm-4">
        <img src={thumbnail_path} title={movie.name} />
      </div>
    </a>
  );
}

export default MovieGridTile;
