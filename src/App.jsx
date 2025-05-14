import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookmarksPage from "./pages/BookmarksPage/BookmarksPage";
import Nav from "./components/Navbar/Navbar";
import CrimeDataPage from "./pages/CrimeDataPage/CrimeDataPage";

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/crime" element={<CrimeDataPage />} />
      </Routes>
    </Router>
  );
}

export default App;
