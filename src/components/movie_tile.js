import React, { Component } from 'react';

const MovieTile = ({movie}) => {
  console.log(movie);

  // TODO: call the configuration path to fetch the base URLs
  const thumbnail_path = `https://image.tmdb.org/t/p/w185/${movie.poster_path}`
  const link = `https://www.themoviedb.org/movie/${movie.id}`
  console.log(thumbnail_path);

  const {id, title = 'N/A', popularity, overview}  = movie;

  return (
    <a href={link} window="themoviedb">
      <div className="movieTile list-group-item">
        <div class="col-sm-4">
          <img src={thumbnail_path} />
        </div>
        <div class="col-sm-8">
          <div className="movieId">{id}</div>
          <div className="movieTitle">{title}</div>
          <div className="moviePopularity">{popularity}</div>
          <div className="movieSynopsis">{overview}</div>
        </div>
      </div>
    </a>
  );
}

export default MovieTile;
