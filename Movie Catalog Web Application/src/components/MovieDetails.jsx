import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "./NavBar"; // Include NavBar for consistent navigation

const MovieDetails = () => {
  const { state } = useLocation(); // Access movie data passed from Home
  const navigate = useNavigate();

  // Access the movie data passed from Home
  const movie = state?.movie;

  if (!movie) {
    return <p>No movie details available. Please go back and try again.</p>;
  }

  return (
    <div className="home-wrapper">
      <NavBar />
      <div className="main-content">
        
        <div className="movie-details-card">
          <img
            src={movie.poster || "https://via.placeholder.com/200x300"}
            alt={`${movie.title} Poster`}
            className="movie-poster-large"
          />
          <div className="movie-details-content">
            <h2>{movie.title}</h2>
            <p><strong>Overview:</strong> {movie.overview}</p>
            <p><strong>Genres:</strong> {movie.genres}</p>
            <p><strong>Rating:</strong> {movie.vote_average}</p>
            <p><strong>Release Date:</strong> {movie.release_date}</p>
            <button className="back-button" onClick={() => navigate("/")}>
          Back to Home
        </button>
          </div>
          
        </div>

      </div>
      
    </div>
  );
};

export default MovieDetails;
