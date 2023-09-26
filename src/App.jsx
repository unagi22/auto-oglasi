import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  NavLink,
} from "react-router-dom";
import Home from "./pages/home";
import Posts from "./pages/posts";
import About from "./pages/about";
import "./App.css";

function Logo() {
  return (
    <Link to="/" style={{ textDecoration: "none", color: "white" }}>
      <h1>Vozila.me</h1>
    </Link>
  );
}

function Profile() {
  return <div>Profile Page</div>;
}

function App() {
  return (
    <Router>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <nav>
          <Logo />
          <ul className="header-links">
            <li>
              <Link to="/posts">Posts</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
        </Routes>

        <footer>
          <Link to="/about">
            <button>About Us</button>
          </Link>
        </footer>
      </div>
    </Router>
  );
}

export default App;
