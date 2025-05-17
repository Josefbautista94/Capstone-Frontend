// src/components/Navbar/Navbar.jsx
import "./Navbar.css";
import { useState } from "react"; // Importing useState hook from React
import { Link } from "react-router-dom"; // lets you navigate between pages in React app without reloading the page (unlike <a>)

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // I track whether the mobile hamburger menu is open. It starts off closed (false)

  const toggleMenu = () => setIsOpen(!isOpen); // This function toggles the menu open and closed when the hamburger icon is clicked.

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        {/* logo/appName */}
        <Link to="/" onClick={() => setIsOpen(false)}>
          🗽 NYC Crime Tracker
        </Link>
      </div>
      {/* This is the hamburger menu button, its only visible in smaller screens */}
      {/* When clicked, it runs toggleMenu, which toggles the isOpen state */}
      {/* using the isOpen state to dynamically apply the open class to each bar. When active, CSS transforms rotate the top and bottom bars and hide the middle one, turning the hamburger into an X. */}
      <div className="hamburger" onClick={toggleMenu}>
        <span className={`bar ${isOpen ? "open" : ""}`}></span>
        <span className={`bar ${isOpen ? "open" : ""}`}></span>
        <span className={`bar ${isOpen ? "open" : ""}`}></span>
      </div>

      <ul className={`navbar-links ${isOpen ? "active" : ""}`}>
        <li>
          <Link to="/" onClick={() => setIsOpen(false)}>
            Home
          </Link>
        </li>
        <li>
            <Link to="/map" onClick={() => setIsOpen(false)}>
            Map
          </Link>
         
        </li>
        <li>
          <Link to="/bookmarks" onClick={() => setIsOpen(false)}>
            Bookmarks
          </Link>
        </li>
        <li>
          <Link to="/crime" onClick={() => setIsOpen(false)}>
            Live Data
          </Link>
        </li>
        <li>
          <Link to="/insights" onClick={() => setIsOpen(false)}>
            Insights
          </Link>
        </li>
      </ul>
    </nav>
  );
}
