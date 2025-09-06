import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar";
import "../styles/main.css";
import { useAuth } from "../login/AuthContext";

const Home = () => {
  const { apiKey } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null); // Track only the ID of the selected movie
  const [watchedMovies, setWatchedMovies] = useState([]); // IDs of watched movies
  const [addToWatchlist, setAddToWatchlist] = useState({});
  const [updateRequired, setUpdateRequired] = useState(false); // For the update button

  const navigate = useNavigate();

  // Fetch movies from API
  const fetchMovies = async (selectedCategory = "") => {
    try {
      const url = selectedCategory
        ? `https://loki.trentu.ca/~anhtuanhoang/3430/A3api/api/movies?category=${selectedCategory}`
        : `https://loki.trentu.ca/~anhtuanhoang/3430/A3api/api/movies`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch movies");
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  // Fetch watched movies
  const fetchWatchedMovies = async () => {
    try {
      const response = await fetch(
        "https://loki.trentu.ca/~anhtuanhoang/3430/A3api/api/completedwatchlist",
        {
          method: "GET",
          headers: { Authorization: apiKey },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch watched movies");
      const data = await response.json();
      const watchedMovieIds = data.map((movie) => movie.movie_id);
      setWatchedMovies(watchedMovieIds);
    } catch (error) {
      console.error("Error fetching watched movies:", error);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://loki.trentu.ca/~anhtuanhoang/3430/A3api/api/categories"
      );
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const viewDetails = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } }); // Pass the movie data through state
  };
  
  // Add selected movies to the watchlist
  const handleAddToWatchlist = async () => {
    try {
      const selectedMovies = Object.keys(addToWatchlist)
        .filter((id) => addToWatchlist[id])
        .map((id) => parseInt(id, 10));

      for (const movieId of selectedMovies) {
        const response = await fetch(
          "https://loki.trentu.ca/~anhtuanhoang/3430/A3api/api/towatchlist",
          {
            method: "POST",
            headers: {
              Authorization: apiKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ movie_id: movieId, priority: 5 }),
          }
        );

        if (!response.ok) {
          if (response.status === 409) {
            console.error(`Movie ID ${movieId} is already in the watchlist.`);
            alert(`Movie ID ${movieId} is already in the watchlist.`);
          } else {
            throw new Error("Failed to add movie to watchlist.");
          }
        }
        else{
          alert("Movies added to watchlist successfully!");
        }
      }

      setAddToWatchlist({});
      setUpdateRequired(false);
    } catch (error) {
      console.error("Error adding movies to watchlist:", error);
    }
  };

  // Handle checkbox toggle for adding to watchlist
  const toggleAddToWatchlist = (movieId) => {
    setAddToWatchlist((prev) => {
      const updated = { ...prev, [movieId]: !prev[movieId] };
      setUpdateRequired(Object.values(updated).some((checked) => checked)); // Show update button if any movie is selected
      return updated;
    });
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    fetchMovies(e.target.value); // Fetch movies for the selected category
  };



  const filteredMovies = movies.filter((movie) =>
    movie.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchMovies();
    fetchCategories();
    fetchWatchedMovies();
  }, []);

  return (
    <div className="home-wrapper">
      <NavBar />
      <div className="header fixed-header">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search Movies"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <select value={category} onChange={handleCategoryChange} className="select-bar">
            <option value="">All Categories</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="main-content">
        <div className="movie-list">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img
                src={movie.poster || "https://via.placeholder.com/200x300"}
                alt={`${movie.title} Poster`}
                className="movie-poster"
              />
              <h4>{movie.title}</h4>
              <div className="movie-actions">
                <input
                  type="checkbox"
                  checked={!!addToWatchlist[movie.id]}
                  onChange={() => toggleAddToWatchlist(movie.id)}
                  disabled={watchedMovies.includes(movie.id)} // Disable if already watched
                />
                <span>Add to Watchlist</span>
              <button
                className="view-details"
                onClick={() => viewDetails(movie)}
              >
                View Details
              </button>

              </div>
              {selectedMovieId === movie.id && (
                <div className="movie-details">
                  <p>
                    <strong>Overview:</strong> {movie.overview}
                  </p>
                  <p>
                    <strong>Rating:</strong> {movie.vote_average}
                  </p>
                  <p>
                    <strong>Categories:</strong> {movie.genres}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {updateRequired && (
        <button 
          className="update-watchlist-button" 
          onClick={handleAddToWatchlist}
        >
          Update Watchlist
        </button>
      )}
    </div>
  );
};

export default Home;
