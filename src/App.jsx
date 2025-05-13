import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookmarksPage from "./pages/BookmarksPage/BookmarksPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/bookmarks" element={<BookmarksPage />} />
      </Routes>
    </Router>
  );
}

export default App;
 