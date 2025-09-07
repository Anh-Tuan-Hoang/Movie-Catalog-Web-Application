import React, { useState, useEffect } from "react";
import NavBar from "../NavBar";
import "../styles/main.css"; // Use the combined CSS file
import { useAuth } from "../login/AuthContext";
import { useNavigate } from "react-router-dom";

const WatchedList = () => {
  const { apiKey } = useAuth(); // Retrieve the API key from context
  const [searchTerm, setSearchTerm] = useState("");
  const [sortByRating, setSortByRating] = useState(false);
  const [watchedList, setWatchedList] = useState([]);
  const [categories, setCategories] = useState([]); // State for categories
  const [category, setCategory] = useState(""); // State for selected category
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [editedScores, setEditedScores] = useState({}); // Track edited scores
  const [editedTimesWatched, setEditedTimesWatched] = useState({}); // Track edited times watched
  const navigate = useNavigate();

  // Fetch watched list from the API
  const fetchWatchedList = async () => {
    try {
      const response = await fetch(
        "https://loki.trentu.ca/~anhtuanhoang/3430/A3api/api/completedwatchlist",
        {
          method: "GET",
          headers: {
            Authorization: apiKey, // Pass the API key
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch the watched list.");
      }

      const data = await response.json();
      setWatchedList(data);
    } catch (error) {
      console.error("Error fetching the watched list:", error);
    }
  };

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://loki.trentu.ca/~anhtuanhoang/3430/A3api/api/categories"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch categories.");
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Handle saving the edited scores and times watched
  const saveUpdates = async () => {
    try {
      const updates = Object.keys({ ...editedScores, ...editedTimesWatched }).map(
        async (movieId) => {
          const score = editedScores[movieId];
          const timesWatched = editedTimesWatched[movieId];

          const body = {};
          if (score) body.rating = score;
          if (timesWatched) body.times_watched = timesWatched;

          const response = await fetch(
            `https://loki.trentu.ca/~anhtuanhoang/3430/A3api/api/completedwatchlist/${movieId}`,
            {
              method: "PUT",
              headers: {
                Authorization: apiKey,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to update data for movie ID ${movieId}.`);
          }
        }
      );

      await Promise.all(updates);
      setEditedScores({}); // Clear the edited scores
      setEditedTimesWatched({}); // Clear the edited times watched
      fetchWatchedList(); // Refresh the list
      alert("Updates saved successfully!");
    } catch (error) {
      console.error("Error saving updates:", error);
      alert(error.message);
    }
  };

  // Handle score change
  const handleScoreChange = (movieId, newScore) => {
    setEditedScores((prev) => ({
      ...prev,
      [movieId]: newScore,
    }));
  };

  // Handle times watched change
  const handleTimesWatchedChange = (movieId, newTimesWatched) => {
    setEditedTimesWatched((prev) => ({
      ...prev,
      [movieId]: newTimesWatched,
    }));
  };

  // Toggle movie details
  const showDetails = (movie) => {
    setSelectedMovie(
      selectedMovie?.completed_id === movie.completed_id ? null : movie
    );
  };

  // Handle search input change
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  // Handle category selection change
  const handleCategoryChange = (e) => setCategory(e.target.value);

  // Handle sorting checkbox change
  const handleSortChange = (e) => setSortByRating(e.target.checked);
  const viewDetails = (movie) => {
    navigate(`/movie/${movie.completed_id}`, { state: { movie } });
  };
  
  // Filter and sort the watched list
  const filteredMovies = watchedList
    .filter((movie) =>
      movie.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((movie) =>
      category ? movie.genres?.toLowerCase().includes(category.toLowerCase()) : true
    )
    .sort((a, b) =>
      sortByRating
        ? b.vote_average - a.vote_average // Sort by rating
        : a.completed_id - b.completed_id // Default sort by ID
    );

  useEffect(() => {
    fetchWatchedList();
    fetchCategories(); // Fetch categories on component mount
  }, []);

  return (
    <div className="home-wrapper">
      <NavBar />
      <div className="main-content">
        <div className="header">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search Movies"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <select value={category} onChange={handleCategoryChange}>
              <option value="">All Categories</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="sort-options">
          <label>
            <input
              type="checkbox"
              checked={sortByRating}
              onChange={handleSortChange}
            />
            Sort by Rating
          </label>
        </div>

        <div className="movie-list">
          {filteredMovies.map((movie) => (
            <div key={movie.completed_id} className="movie-card">
              <img
                src={movie.poster || "https://via.placeholder.com/200x300"}
                alt={`${movie.title} Poster`}
                className="movie-poster"
              />
              <h4>{movie.title}</h4>
              <div className="score-input">
               <div className="score-input">
  <label>
    Score:
    <input
      type="number" // Allow numbers
      step="0.1" // Allow increments of 0.1 for decimal values
      min="0.1" // Minimum score
      max="10" // Maximum score
      value={editedScores[movie.completed_id] ?? movie.rating}
      onChange={(e) =>
        handleScoreChange(
          movie.completed_id,
          parseFloat(e.target.value) // Parse the value as a float
        )
      }
    />
  </label>
</div>

              </div>
              <div className="times-watched-input">
                <label>
                  Times Watched:
                  <input
                    type="number"
                    min="1"
                    value={
                      editedTimesWatched[movie.completed_id] ??
                      movie.times_watched
                    }
                    onChange={(e) =>
                      handleTimesWatchedChange(
                        movie.completed_id,
                        parseInt(e.target.value, 10)
                      )
                    }
                  />
                </label>
              </div>
              <div className="movie-actions">
              <button
                className="view-details"
                onClick={() => viewDetails(movie)}
              >
                View Details
              </button>
              </div>
              {selectedMovie?.completed_id === movie.completed_id && (
                <div className="movie-details">
                  <p><strong>Overview:</strong> {movie.overview}</p>
                  <p><strong>Initial Watch:</strong> {movie.date_initially_watched}</p>
                  <p><strong>Last Watched:</strong> {movie.date_last_watched}</p>
                  <p><strong>Notes:</strong> {movie.notes}</p>
                  <p><strong>Genres:</strong> {movie.genres}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {(Object.keys(editedScores).length > 0 ||
          Object.keys(editedTimesWatched).length > 0) && (
          <button className="save-scores-button" onClick={saveUpdates}>
            Save Updates
          </button>
        )}

{filteredMovies.length === 0 && (
  <p className="no-movies-message">
    Your watched list is empty.Please add some movies to get started!
  </p>
)}
      </div>
    </div>
  );
};

export default WatchedList;
