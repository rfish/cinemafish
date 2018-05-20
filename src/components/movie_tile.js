import React, { Component } from 'react';

const MovieTile = ({movie}) => {
  console.log(movie);

  // TODO: call the configuration path to fetch the base URLs
  const thumbnail_path = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
  const link = `https://image.tmdb.org/t/p/${movie.id}`
  console.log(thumbnail_path);

  return (
    <a href={link}>
      <div className="movieTile">
        <div class="row">
          <div class="col-sm-4">
            <img src={thumbnail_path} />
          </div>
          <div class="col-sm-8">
            <div className="movieId">{movie.id}</div>
            <div className="movieTitle">{movie.title}</div>
            <div className="moviePopularity">{movie.popularity}</div>
            <div className="movieSynopsis">{movie.overview}</div>
          </div>
        </div>      
      </div>
    </a>
  );
}

export default MovieTile;
