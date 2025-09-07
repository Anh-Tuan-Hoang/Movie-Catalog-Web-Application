import React, { useState, useEffect } from "react";
import NavBar from "../NavBar";
import { useAuth } from "../login/AuthContext";
import "../styles/main.css";
import { useNavigate } from "react-router-dom";

const ToWatchList = () => {
  const { apiKey } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [sortByPriority, setSortByPriority] = useState(false);
  const [toWatchList, setToWatchList] = useState([]);
  const [editedPriorities, setEditedPriorities] = useState({});
  const [selectedActions, setSelectedActions] = useState({}); // Track selected actions
  const navigate = useNavigate();

  // Fetch the to-watch list from the API
  const fetchToWatchList = async () => {
    try {
      const response = await fetch(
        "https://loki.trentu.ca/~anhtuanhoang/3430/A3api/api/towatchlist",
        {
          method: "GET",
          headers: { Authorization: apiKey },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch the to-watch list.");
      const data = await response.json();
      setToWatchList(data);
    } catch (error) {
      console.error("Error fetching the to-watch list:", error);
    }
  };

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://loki.trentu.ca/~anhtuanhoang/3430/A3api/api/categories"
      );

      if (!response.ok) throw new Error("Failed to fetch categories.");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Mark a movie as watched
  const markAsWatched = async (movieId) => {
    try {
      const response = await fetch(
        "https://loki.trentu.ca/~anhtuanhoang/3430/A3api/api/completedwatchlist",
        {
          method: "POST",
          headers: {
            Authorization: apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ movie_id: movieId, rating: 2 }), // Default rating for now
        }
      );

      if (!response.ok) throw new Error("Failed to mark movie as watched.");
    } catch (error) {
      console.error("Error marking movie as watched:", error);
      throw error; // Propagate the error to handle it in the batch
    }
  };

  // Remove a movie from the watchlist
  const removeFromWatchlist = async (movieId) => {
    try {
      const response = await fetch(
        `https://loki.trentu.ca/~anhtuanhoang/3430/A3api/api/towatchlist/${movieId}`,
        {
          method: "DELETE",
          headers: { Authorization: apiKey },
        }
      );

      if (!response.ok) throw new Error("Failed to remove movie from watchlist.");
    } catch (error) {
      console.error("Error removing movie from watchlist:", error);
      throw error; // Propagate the error to handle it in the batch
    }
  };

  // Save all changes including priorities
  const saveAllChanges = async () => {
    try {
      const actionPromises = Object.entries(selectedActions).map(
        async ([movieId, action]) => {
          if (action === "watched") {
            await markAsWatched(movieId);
          } else if (action === "remove") {
            await removeFromWatchlist(movieId);
          }
        }
      );

      const priorityPromises = Object.keys(editedPriorities).map(async (movieId) => {
        const priority = editedPriorities[movieId];
        if (priority < 1 || priority > 10) throw new Error("Priority must be between 1 and 10.");

        const response = await fetch(
          `https://loki.trentu.ca/~anhtuanhoang/3430/A3api/api/towatchlist/${movieId}`,
          {
            method: "PUT",
            headers: {
              Authorization: apiKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ priority }),
          }
        );

        if (!response.ok) throw new Error(`Failed to update priority for movie ID ${movieId}.`);
      });

      await Promise.all([...actionPromises, ...priorityPromises]);

      setEditedPriorities({});
      setSelectedActions({});
      fetchToWatchList(); // Refresh the to-watch list
      alert("Changes have been applied successfully!");
    } catch (error) {
      console.error("Error applying changes:", error);
      alert("There was an error applying the changes. Please check the console for details.");
    }
  };

  // Handle action selection (watched or remove)
  const handleActionChange = (movieId, action) => {
    setSelectedActions((prev) => {
      const newActions = { ...prev };
      if (newActions[movieId] === action) {
        // Deselect the action
        delete newActions[movieId];
      } else {
        newActions[movieId] = action;
      }
      return newActions;
    });
  };

  // Handle priority change
  const handlePriorityChange = (movieId, newPriority) => {
    setEditedPriorities((prev) => ({ ...prev, [movieId]: newPriority }));
  };
  //header

  const viewDetails = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } }); // Pass the movie data through state
  };
  // Filter and sort movies based on search, category, and sort preferences
  const filteredMovies = toWatchList
    .filter((movie) =>
      movie.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((movie) =>
      category ? movie.genres?.toLowerCase().includes(category.toLowerCase()) : true
    )
    .sort((a, b) =>
      sortByPriority ? b.priority - a.priority : a.towatch_id - b.towatch_id
    );

  // Fetch data on component mount or when apiKey changes
  useEffect(() => {
    fetchToWatchList();
    fetchCategories();
  }, [apiKey]);

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
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label>
          <input
            type="checkbox"
            checked={sortByPriority}
            onChange={(e) => setSortByPriority(e.target.checked)}
          />
          Sort by Priority
        </label>

        <div className="movie-list">
          {filteredMovies.map((movie) => {
            const action = selectedActions[movie.movie_id] || null;
            const isRemoveChecked = action === "remove";

            return (
              <div key={movie.movie_id} className="movie-card">
                <img
                  src={movie.poster || "https://via.placeholder.com/200x300?text=No+Image"}
                  alt={`${movie.title} Poster`}
                  className="movie-poster"
                />
                <h4>{movie.title}</h4>
                <div className="priority-input">
                  <label>
                    Priority:
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={editedPriorities[movie.movie_id] ?? movie.priority}
                      onChange={(e) =>
                        handlePriorityChange(
                          movie.movie_id,
                          parseInt(e.target.value, 10)
                        )
                      }
                    />
                  </label>
                  <button
                className="view-details"
                onClick={() => viewDetails(movie)}
              >
                View Details
              </button>
                </div>
                <div className="movie-actions">
                  <div>
                    
                    <label>
                      <input
                        type="checkbox"
                        checked={isRemoveChecked}
                        onChange={() => handleActionChange(movie.movie_id, "remove")}
                      />
                      Remove
                    </label>
                  </div>
                  <div>
                    <label>
                      <input
                        type="checkbox"
                        checked={action === "watched"}
                        disabled={isRemoveChecked}
                        onChange={() => handleActionChange(movie.movie_id, "watched")}
                      />
                      Mark as Watched
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Show Save All Changes button */}
        {Object.keys(selectedActions).length > 0 || Object.keys(editedPriorities).length > 0 ? (
          <button className="save-all-changes-button" onClick={saveAllChanges}>
            Apply All Changes
          </button>
        ) : null}

{filteredMovies.length === 0 && (
  <p className="no-movies-message">
    Your plan list is empty.Please add some movies to get started!
  </p>
)}      </div>
    </div>
  );
};

export default ToWatchList;
