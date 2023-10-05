import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import Posts from "../pages/posts";
import About from "../pages/about";
import Profile from "../pages/profile";
import RegistrationForm from "../components/RegistrationForm";
import Admin from "../pages/admin.jsx";
import Login from "../pages/Login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/posts" element={<Posts />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<RegistrationForm />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
};

export default AppRoutes;
