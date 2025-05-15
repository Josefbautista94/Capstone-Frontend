import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookmarksPage from "./pages/BookmarksPage/BookmarksPage";
import Nav from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import CrimeDataPage from "./pages/CrimeDataPage/CrimeDataPage";
import MapPage from "./pages/MapPage/MapPage";
import InsightsPage from "./pages/InsightsPage/InsightsPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/crime" element={<CrimeDataPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/insights" element={<InsightsPage />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
