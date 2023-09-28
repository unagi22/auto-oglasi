import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import Logo from "./components/logo";
import Footer from "./components/footer";
import AppRoutes from "./routes/routes";
import "./App.css";

const App = () => {
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
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>
        <AppRoutes />
        <Footer />
      </div>
    </Router>
  );
};

export default App;
