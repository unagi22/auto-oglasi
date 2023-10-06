import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import Posts from "../pages/posts";
import About from "../pages/about";
import Profile from "../pages/profile";
import Admin from "../pages/admin/admin.jsx";
import Login from "../pages/Login.jsx";
import RegistrationForm from "../components/RegistrationForm";
import VerifyEmail from "../pages/VerifyEmail.jsx";
import NotFound from "../components/NotFound.jsx";

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
      <Route path="/verify-email/:token/" element={<VerifyEmail />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
