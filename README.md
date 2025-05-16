# 🗽 NYC Crime Tracker — React + Vite

A full-stack web application that displays real-time crime data from the NYPD using the NYC Open Data API. Users can explore crimes on an interactive map, bookmark specific cases, and contribute anonymous comments. This project was built as a capstone for the Per Scholas Software Engineering program.

---

## 📌 Features

-  **Live Data View**: View recent crimes grouped by borough
-  **Interactive Map**: Visualize crime locations in NYC with Leaflet.js
-  **Bookmarking**: Save specific crimes to track later
-  **Community Comments**: Add anonymous location-based notes
-  **Borough Filtering**: Focus on specific areas in the city
- **Dark Theme UI**: Built for readability and style

---

## Tech Stack

**Frontend:**
- React + Vite
- React Leaflet (maps)
- Axios
- CSS Modules

**Backend:**
- Node.js + Express
- MongoDB (via Mongoose)
- RESTful API

**Data Source:**
- [NYC Open Data - NYPD Complaint Data (5uac-w243)](https://data.cityofnewyork.us/Public-Safety/NYPD-Complaint-Data-Current-Year-To-Date-/5uac-w243)

---

##  Getting Started

1. **Clone this repo**

  
   git clone https://github.com/Josefbautista94/Capstone-Frontend.git


 2. **Install dependencies**


   
 cd frontend
npm install

3. **Run the frontend**


npm run dev

4. (Optional) Start the backend in /backend directory.

Link here : https://github.com/Josefbautista94/Capstone-Backend

---

## Challenges Faced
- Learning and working with NYC Open Data required understanding SoQL syntax and optimizing API queries.

- Syncing map behavior with Leaflet.js (centering, zooming, and popups) involved some debugging and edge case handling.

- Creating an anonymous comment system that was intuitive and location-aware required both UI and backend planning.

  - Keeping MongoDB data in sync with frontend state after bookmarking or deleting involved precise use of React hooks and Axios calls.

- Designing a fully responsive UI across desktop and mobile required thoughtful layout adjustments, especially for maps and sidebars.

## Lessons Learned
- Gained full-stack development experience building a complete MERN application from the ground up.

- Developed confidence working with public APIs, data filtering with SoQL, and visualizing spatial data.

- Strengthened backend development skills using Express and MongoDB with custom schemas and route logic.

- Improved React state management, component architecture, and UI/UX refinement through feedback and iteration.

- Learned how to break down features into manageable chunks and solve integration issues end-to-end.

## Future Plans
- Add visual analytics and trend graphs (e.g., top crime categories by borough)

- Allow editing of user-added notes and support historical note timelines

- Add user accounts and login to personalize bookmarks

- Convert the app into a PWA for mobile/offline use

- Add marker clustering on the map to handle dense crime areas

- Expand support to other open-data cities beyond NYC

##  License

This project is open source and free to use.

