import "./HomePage.css"

export default function Homepage() {
  return (
    <div className="home-container">
      <h1>🗽 Welcome to NYC Crime Tracker</h1>
      <p>
        Get real-time insights into NYC crime trends.
        <br />
        Use the navigation bar above to explore live data, maps, and community feedback.
      </p>

      <ul className="feature-list">
  <li>📊 Live crime data from NYC Open Data</li>
  <li>🗺️ Interactive map with borough filters</li>
  <li>📌 Bookmark crimes you want to track</li>
  <li>💬 Drop anonymous comments by location</li>
  <li>🔍 Insights coming soon!</li>
</ul>

    </div>
  );
}