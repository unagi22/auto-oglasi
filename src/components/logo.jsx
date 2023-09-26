import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" style={{ textDecoration: "none", color: "white" }}>
      <h1>Vozila.me</h1>
    </Link>
  );
};

export default Logo;
