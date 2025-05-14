import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link> |{" "}
      <Link to="/crime">Live Data</Link> |{" "}
      <Link to="/bookmarks">Bookmarks</Link> |{" "}
      <Link to="/map">Map</Link> |{" "}
      <Link to="/insights">Insights</Link>
    </nav>
  );
}
