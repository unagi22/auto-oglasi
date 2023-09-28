import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Logo from "./components/Logo";
import Footer from "./components/Footer";
import AppRoutes from "./routes/routes";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
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
      </BrowserRouter>
    </>
  );
}

export default App;
