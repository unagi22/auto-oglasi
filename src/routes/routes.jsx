import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Posts from "../pages/Posts";
import About from "../pages/About";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import RegistrationForm from "../components/RegistrationForm";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/posts" element={<Posts />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<RegistrationForm />} />
    </Routes>
  );
};

export default AppRoutes;