import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faEye, faList, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/">
            Best Flix Streaming
          </Link>
        </li>
                <li className="nav-item">
          <Link to="/">
            <FontAwesomeIcon icon={faHome} className="icon" /> Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/WatchedList">
            <FontAwesomeIcon icon={faEye} className="icon" /> Watched Movies
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/ToWatchList">
            <FontAwesomeIcon icon={faList} className="icon" /> To Watch List
          </Link>
        </li>
        <li className="nav-item sign-out">
          <Link to="/login">
            <FontAwesomeIcon icon={faSignOutAlt} className="icon" /> Sign Out
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;