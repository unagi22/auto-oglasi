import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" style={{ textDecoration: "none", color: "white" }}>
      <h1>MojeVozilo</h1>
    </Link>
  );
};

export default Logo;
