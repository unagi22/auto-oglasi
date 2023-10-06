import { BrowserRouter as Router, Link } from "react-router-dom";
import Logo from "./components/logo";
import Footer from "./components/footer";
import AppRoutes from "./routes/routes";
import "./App.css";
import Api from "./services/Api.js";
import { Button, Popover } from "@mui/material";
import { auto } from "@popperjs/core";
import ResponsiveAppBar from "./components/navbar";
import { Box } from "@mui/system";
import { useState, useEffect } from "react";

const api = Api.getInstance();

const App = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const toggleDrawer = () => setShowDrawer((prev) => !prev);
  const handleResize = () => {
    if (window.innerWidth > 600) {
      setShowDrawer(false);
    }
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
  });
  return (
    <Router>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <nav>
          <Logo />
          <Box sx={{ display: { sm: "none" } }}>
            <input
              type="checkbox"
              role="button"
              aria-label="Display the menu"
              className="menuIcon"
              onClick={toggleDrawer}
            />
          </Box>

          <ul className={showDrawer ? "popoverList" : "header-links"}>
            {/* {api.isAuthenticated ? ( */}
            <>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/admin">
                  {api.isSuperuser ? "Admin panel" : "User data"}
                </Link>
              </li>
              <li>
                <Link onClick={() => api.logout()}>Logout</Link>
              </li>
            </>

            {/* ) : (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )} */}
          </ul>
        </nav>
        <div
          style={{
            height: "calc(100vh - 110px - 56px)",
            margin: 0,
            overflow: auto,
          }}
        >
          <AppRoutes />
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
