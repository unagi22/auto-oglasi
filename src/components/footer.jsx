import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <Link to="/about">
        <button>About Us</button>
      </Link>
    </footer>
  );
};

export default Footer;
