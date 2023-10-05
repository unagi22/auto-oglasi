import { BrowserRouter as Router, Link } from "react-router-dom";
import Logo from "./components/logo";
import Footer from "./components/footer";
import AppRoutes from "./routes/routes";
import "./App.css";
import Api from "./services/Api.js";
import {Button} from "@mui/material";


const api = Api.getInstance();

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
            {api.isAuthenticated ? (
                <>
                  <li>
                    <Link to="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link to="/admin">{api.isSuperuser ? 'Admin panel' : 'User data'}</Link>
                  </li>
                  <li>
                    <Button variant="contained" color="warning" onClick={() => api.logout()}>
                      Logout
                    </Button>
                  </li>
                </>
            ) : (
                <li>
                  <Link to="/login">Login</Link>
                </li>
            )}
          </ul>
        </nav>
        <div style={{ height: 'calc(100vh - 110px - 56px)', margin: 0 }}>
          <AppRoutes />
        </div>
        <Footer />
      </div>
  </Router>
  )
};

export default App;
