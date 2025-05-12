import { useEffect, useState } from "react";
import api from "../api/api"; // Axios helper

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]); //bookmarks, the current state value (an array of bookmarks)
  // setBookmarks is the function to update the state, this starts off as an empty array []

  useEffect(() => {
    // This is react's way of saying, "Run this code after the component loads (once)"
    api
      .get("/bookmarks") //  trying to send a GET request to your backend route at : http://localhost:5001/api/bookmarks
      .then((res) => setBookmarks(res.data)) // When the GET request is successful we get access to res.data(the array of bookmarks), and we set the bookmarks state to that data
      .catch(
        (
          err // If there's an error (e.g. server is down, wrong URL), this catches it
        ) => console.error("There was an error fetching the bookmarks:", err) // log a message + the actual error
      );
  }, []); // The empty [] dependency array means, only run this once, like componentDidMount in class based components

  return (
    <div>
      <h1>📍 Saved Bookmarks </h1>
      <ul>
        {bookmarks.map((b) => ( // .map() loops through the bookmarks array, For each bookmark (b), it creates an <li>
          <li key={b._id}> {/* Each bookmark becomes a list item, the key={b._id} is a React requirement when mapping over arrays*/}
            <strong>{b.ofnsDesc}</strong>-{b.boroNm}{/*Inside each <li>, we're rendering: The offense description in bold (e.g., "ROBBERY") - then the borough name (e.g., "QUEENS")*/}
          </li>
        ))}
      </ul>
    </div>
  );
}
