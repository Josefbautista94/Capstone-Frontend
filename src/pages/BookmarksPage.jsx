import { useEffect, useState } from "react";
import api from "../api/api"; // Axios helper

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]); //bookmarks, the current state value (an array of bookmarks)
  // setBookmarks is the function to update the state, this starts off as an empty array []

  useEffect(() => {
    // React hook that lets you run side effects in my component
    fetchBookmarks(); // This calls the function that sends a GET request to the backend
  }, []); // Only run this effect once, when the component first mounts aka loads

  const fetchBookmarks = () => {
    api
      .get("/bookmarks") //  trying to send a GET request to your backend route at : http://localhost:5001/api/bookmarks
      .then((res) => setBookmarks(res.data)) // When the GET request is successful we get access to res.data(the array of bookmarks), and we set the bookmarks state to that data
      .catch(
        (
          err // If there's an error (e.g. server is down, wrong URL), this catches it
        ) => console.error("There was an error fetching the bookmarks:", err) // log a message + the actual error
      );
  };

  const handleDelete = (id) => {
    // _id of the bookmark that I want to delete
    api
      .delete(`/bookmarks/${id}`) // This sends a DELETE request to the backend using Axios
      // If id = "661b123haha", the request goes to: http://localhost:5001/api/bookmarks/661b123haha
      .then(() => {
        setBookmarks((prev) => prev.filter((b) => b._id !== id)); // Removes from UI, prev is the previous state of bookmarks (an array), .filter() creates a new array that: Keeps every bookmark except the one with the matching _id.
      })
      .catch((err) => console.error("Error deleting bookmark:", err));
  };

  return (
    <div>
      <h1>📍 Saved Bookmarks </h1>
      <ul>
        {bookmarks.map(
          (
            b // .map() loops through the bookmarks array, For each bookmark (b), it creates an <li>
          ) => (
            <li key={b._id}>
              {" "}
              {/* Each bookmark becomes a list item, the key={b._id} is a React requirement when mapping over arrays*/}
              <strong>{b.ofnsDesc}</strong> - {b.boroNm}
              {/*Inside each <li>, we're rendering: The offense description in bold (e.g., "ROBBERY") - then the borough name (e.g., "QUEENS")*/}
              <button
                onClick={() => handleDelete(b._id)} // When this button is clicked, call handleDelete() and pass in the ID of this specific bookmark.
                style={{ marginLeft: "10px" }}
              >
                Delete 🗑️
              </button>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
