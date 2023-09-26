import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import Posts from "../pages/posts";
import About from "../pages/about";
import Profile from "../pages/profile";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/posts" element={<Posts />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

export default AppRoutes;
