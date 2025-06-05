import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"; //These are core map components from React Leaflet. I use MapContainer as the base map, TileLayer for the actual map visuals, and then Marker and Popup to place and describe each crime.
import nycCrimeApi from "../../api/nycCrimeApi";
import api from "../../api/api"; // backend Axios instance
import L from "leaflet"; // This lets me patch Leaflet’s default marker icon paths, which don’t work in Vite out of the box. Without this fix, the pins on the map wouldn't appear.
import "leaflet/dist/leaflet.css"; // Leaflet needs its own CSS file to display the map properly, so I load that globally.
import "./MapPage.css";

// Fix Leaflet's default icon paths
delete L.Icon.Default.prototype._getIconUrl; // Get rid of the broken default image loader Leaflet tries to use,
L.Icon.Default.mergeOptions({
  // overwrites Leaflet’s default marker icon settings.
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png", // High-resolution icon for Retina screens
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png", //Regular marker icon
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png", // The faint shadow below the marker
});

export default function MapPage() {
  // Defining a react functional component and exporting it

  const [crimes, setCrimes] = useState([]); // Creating a variable to hold all the crime data I fetch. It starts out empty, and I’ll fill it later with real data from the NYC API, setCrimes is the function we use to update that value later
  // useState([]): initializes the state with an empty array [] — meaning “no crime data yet

  const [loading, setLoading] = useState(true); //  Tracking whether the app is still fetching the data. It starts as true, and I turn it off when the crime data is ready.

  const [commentText, setCommentText] = useState(""); // Holds the text value of the comment input field as the user types
  const [comments, setComments] = useState([]); // Stores the list of all fetched comments for the selected borough
  const [selectedBorough, setSelectedBorough] = useState(""); // Tracks where user clicked
  const [selectedBoroughFilter, setSelectedBoroughFilter] = useState("All"); // Tracks the currently selected borough filter from the dropdown

  useEffect(() => {
    nycCrimeApi // making a GET request using the custom Axios instance (nycCrimeApi)
      .get("", {
        params: {
          // where we pass query parameters using SoQL (Socrata Query Language) to control the data

          $limit: 1000, // Only grab 500 rows (1000 started making everything go slow)

          $order: "rpt_dt DESC", // Sort by report date, newest first

          $where: "latitude IS NOT NULL AND longitude IS NOT NULL", // Only get crimes that have map coordinates so we can show them on the map

          $select:
            "cmplnt_num,boro_nm,rpt_dt,ofns_desc,law_cat_cd,crm_atpt_cptd_cd,prem_typ_desc,loc_of_occur_desc,station_name,transit_district,hadevelopt,vic_sex,vic_age_group,vic_race,susp_sex,susp_age_group,susp_race,latitude,longitude",

          // Only grab specific fields we actually need (Theres more field in the bottom of this page with the descriptions)

          // Basically i’m asking the NYC API: give me 500 recent crimes that have coordinates and only send me the info I actually need.
        },
      })
      .then((res) => setCrimes(res.data)) // If the fetch works, store all those crimes in my crimes variable so I can map them later.
      .catch(
        (err) =>
          console.error("There was an error fetching the crime data:", err) // If the request fails, log it so I know what went wrong.
      )
      .finally(() => setLoading(false)); // No matter what (success or fail), this runs at the end
  }, []);

  // Handles bookmarking a specific crime when the user clicks "Bookmark This"
  const handleBookmark = (crime) => {
    // Build the payload object using fields from the selected crime
    // This object must match the structure your backend expects in /api/bookmarks
    const payload = {
      cmplntNum: crime.cmplnt_num, // Unique crime ID
      boroNm: crime.boro_nm, // Borough name
      ofnsDesc: crime.ofns_desc, // Offense description
      lawCatCd: crime.law_cat_cd, // Law category (e.g., FELONY)
      pdDesc: "N/A", // Not provided by API, so we use a placeholder
      latitude: parseFloat(crime.latitude), // Convert to number for DB storage
      longitude: parseFloat(crime.longitude), // Convert to number for DB storage
      notes: "", // Empty for now; could support custom notes later
      crmAtptCptdCd: crime.crm_atpt_cptd_cd, // Attempted or Completed
      premTypDesc: crime.prem_typ_desc, // Premise type (e.g., STREET, RESIDENCE)
      locOfOccurDesc: crime.loc_of_occur_desc, // More detail about where the crime occurred
      rptDt: crime.rpt_dt, // Reported date
      stationName: crime.station_name, // Nearby subway station (if present)
      hadevelopt: crime.hadevelopt, // Housing development (if applicable)

      vicSex: crime.vic_sex, // Victim gender
      vicAgeGroup: crime.vic_age_group, // Victim age range
      vicRace: crime.vic_race, // Victim race

      suspSex: crime.susp_sex, // Suspect gender
      suspAgeGroup: crime.susp_age_group, // Suspect age range
      suspRace: crime.susp_race, // Suspect race
    };

    // Send the crime data to the backend to save it as a bookmark
    api
      .post("bookmarks", payload)
      .then(() => {
        // On success, notify the user that the crime was bookmarked
        alert("🔖 Bookmarked Successfully! 👍🏼");
      })
      .catch((err) => {
        // If the backend responds with a 409, that means this crime was already bookmarked
        if (err.response?.status === 409) {
          alert("You already bookmarked this.");
        } else {
          // Log unexpected errors and notify the user
          console.error(
            "There was an error trying to bookmark the crime:",
            err
          );
          alert("Failed to bookmark.");
        }
      });
  };

  // Fetches all comments for a specific borough (area) from the backend
  const fetchComments = (area) => {
    api
      .get(`/comments/${area}`) // Sends a GET request to /api/comments/:area
      .then((res) => setComments(res.data)) // On success, update the comments state with the response data
      .catch((err) =>
        // Log any errors that occur during the request
        console.error("There was an error fetching the comments", err)
      );
  };

  const mapRef = useRef();

  // Filters the list of crimes based on the selected borough
  // If "All" is selected, return the full list of crimes
  // Otherwise, return only crimes that match the selected borough (case-insensitive)
  const filteredCrimes =
    selectedBoroughFilter === "All"
      ? crimes
      : crimes.filter(
          (c) =>
            c.boro_nm &&
            c.boro_nm.toLowerCase() === selectedBoroughFilter.toLowerCase()
        );

  return (
    <>
      <h1 className="map-title">🗺️ NYC Crime Map 🗽</h1>
      <div className="boro-filter">
        <label>Filter by Borough:</label>
        <select
          value={selectedBoroughFilter}
          onChange={(e) => setSelectedBoroughFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Bronx">Bronx</option>
          <option value="Manhattan">Manhattan</option>
          <option value="Brooklyn">Brooklyn</option>
          <option value="Queens">Queens</option>
          <option value="Staten Island">Staten Island</option>
        </select>
      </div>
      <div className="map-page-layout">
        {/* === Sidebar for Comments === */}
        <div className="comment-sidebar">
          <h2>Anonymus Community Comments 🗣️</h2>
          <div className="borough-list">
            {["Bronx", "Manhattan", "Brooklyn", "Queens", "Staten Island"].map(
              (boro) => (
                <button
                  key={boro}
                  onClick={() => {
                    setSelectedBorough(boro);
                    fetchComments(boro);
                  }}
                  className={selectedBorough === boro ? "active" : ""}
                >
                  {boro}
                </button>
              )
            )}
          </div>

          <div className="comment-list">
            {comments.map((c) => (
              <div
                key={c._id}
                className="comment-item"
                onClick={() => {
                  if (c.latitude && c.longitude && mapRef.current) {
                    mapRef.current.setView([c.latitude, c.longitude], 16);
                  }
                }}
              >
                <p>{c.text}</p>
                <small>{c.area}</small>
              </div>
            ))}
          </div>
        </div>
        {loading ? (
          <>
            {/* If the data hasn’t loaded yet, just show ‘Loading Map…’. */}
            <p>Loading Map...</p>
          </>
        ) : (
          <MapContainer // Using Leaflet’s MapContainer and setting it to center on NYC with a moderate zoom level.
            ref={mapRef}
            center={[40.7128, -74.006]} // Sets the map to New York City coordinates
            zoom={12} // Controls how zoomed in the map starts
            scrollWheelZoom={true} // Enables zooming with the mouse scroll wheel
          >
            <TileLayer // This pulls in the map background from OpenStreetMap, like how Google Maps loads its visual layers.
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' // attribution: legally required credit
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // defines how Leaflet pulls map visuals based on zoom level and position
            />
            {filteredCrimes.map((crime) => (
              <Marker
                // For each crime that was loaded, lets place a marker on the map at the correct GPS coordinates.
                key={crime.cmplnt_num}
                position={[
                  parseFloat(crime.latitude), //  adds a marker (pin) on the map for each one using its latitude and longitude.
                  parseFloat(crime.longitude),
                ]}
              >
                <Popup>
                  {/* Display the crime's offense type prominently */}
                  <strong>{crime.ofns_desc}</strong>
                  <br />
                  {/* Show the legal category (e.g., FELONY, MISDEMEANOR) */}
                  <em>Category:</em> {crime.law_cat_cd}
                  <br />
                  {/* Indicates if the crime was completed or attempted */}
                  <em>Status:</em> {crime.crm_atpt_cptd_cd}
                  <br />
                  {/* Display the premise type and specific location of occurrence */}
                  <em>Location:</em> {crime.prem_typ_desc} —{" "}
                  {crime.loc_of_occur_desc}
                  <br />
                  {/* Show which borough the crime took place in */}
                  <em>Borough:</em> {crime.boro_nm}
                  <br />
                  {/* Display the date the crime was reported (first 10 characters = YYYY-MM-DD) */}
                  <em>Reported:</em> {crime.rpt_dt?.slice(0, 10)}
                  <br />
                  {/* Optional: Show nearby subway station if available */}
                  {crime.station_name && (
                    <>
                      <em>Nearby Station:</em> {crime.station_name}
                      <br />
                    </>
                  )}
                  {/* Optional: Show public housing development if applicable */}
                  {crime.hadevelopt && (
                    <>
                      <em>Housing Development:</em> {crime.hadevelopt}
                      <br />
                    </>
                  )}
                  {/* Victim demographic info */}
                  <em>Victim:</em> {crime.vic_sex}, {crime.vic_age_group},{" "}
                  {crime.vic_race}
                  <br />
                  {/* Suspect demographic info, with fallbacks if data is missing */}
                  <em>Suspect:</em> {crime.susp_sex || "Unknown"},{" "}
                  {crime.susp_age_group || "Unknown"},{" "}
                  {crime.susp_race || "Unknown"}
                  <br />
                  <br />
                  {/* Button to bookmark this crime, triggers handleBookmark() */}
                  <button onClick={() => handleBookmark(crime)}>
                    📌 Bookmark This
                  </button>
                  {/* Comment form: allows user to leave an anonymous comment tied to this location */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault(); // Prevent page reload
                      api
                        .post("/comments", {
                          area: crime.boro_nm,
                          text: commentText,
                          latitude: parseFloat(crime.latitude),
                          longitude: parseFloat(crime.longitude),
                        })
                        .then(() => {
                          // Clear input and refresh comments for this borough
                          setCommentText("");
                          setSelectedBorough(crime.boro_nm);
                          fetchComments(crime.boro_nm);
                        })
                        .catch((err) =>
                          console.error(
                            "There was an error posting the comment",
                            err
                          )
                        );
                    }}
                  >
                    {/* Input field for comment text */}
                    <input
                      type="text"
                      placeholder="Add a comment"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />

                    {/* Submit button to post the comment */}
                    <button type="submit">💬</button>
                  </form>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </>
  );
}

/*
========================
📌 NYC Crime API Fields📌
========================
Field                  | Meaning
---------------------- | ------------------------------------------------------------
cmplnt_num             | Unique crime ID
addr_pct_cd            | NYPD precinct code (e.g., 34 = Washington Heights)
boro_nm                | Borough (MANHATTAN, BRONX, etc.)
cmplnt_fr_dt           | Date when the crime started
cmplnt_fr_tm           | Time when the crime started
cmplnt_to_dt           | Date when the crime ended (if known)
cmplnt_to_tm           | Time when the crime ended
crm_atpt_cptd_cd       | Was it Attempted or Completed
hadevelopt             | Housing Authority development name (if applicable)
housing_psa            | Housing Police Service Area number
jurisdiction_code      | Code identifying jurisdiction agency (NYPD = 0)
juris_desc             | Jurisdiction name (e.g., NYPD, TRANSIT)
ky_cd                  | Internal NYPD classification code
law_cat_cd             | Law category — FELONY, MISDEMEANOR, or VIOLATION
loc_of_occur_desc      | Inside or outside (e.g., "FRONT OF", "INSIDE", "OUTSIDE")
ofns_desc              | Offense description (e.g., ROBBERY, ASSAULT)
parks_nm               | Name of park (if crime occurred in one)
patrol_boro            | Patrol borough (e.g., PATROL BORO MAN NORTH)
pd_cd                  | Internal NYPD offense code
pd_desc                | Specific police description (e.g., GRAND LARCENY)
prem_typ_desc          | Premise type — street, residence, etc.
rpt_dt                 | Date crime was reported
station_name           | Nearby train station (if applicable)
susp_age_group         | Suspect's age group (e.g., 18-24, UNKNOWN)
susp_race              | Suspect's race
susp_sex               | Suspect's gender
transit_district       | Transit police district (if subway/bus related)
vic_age_group          | Victim's age group
vic_race               | Victim's race
vic_sex                | Victim's gender
x_coord_cd / y_coord_cd| NYPD internal map coordinates (not GPS)
latitude / longitude   | Actual GPS location
lat_lon                | Combined lat/lon
geocoded_column        | System-generated geolocation point for mapping
*/

// https://dev.socrata.com/foundry/data.cityofnewyork.us/5uac-w243
