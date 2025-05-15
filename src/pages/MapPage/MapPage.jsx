import { useEffect, useState } from "react";
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

  useEffect(() => {
    nycCrimeApi // making a GET request using the custom Axios instance (nycCrimeApi)
      .get("", {
        params: {
          // where we pass query parameters using SoQL (Socrata Query Language) to control the data

          $limit: 500, // Only grab 500 rows (1000 started making everything go slow)

          $order: "rpt_dt DESC", // Sort by report date, newest first

          $where: "latitude IS NOT NULL AND longitude IS NOT NULL", // Only get crimes that have map coordinates so we can show them on the map

          $select:
            "cmplnt_num,boro_nm,rpt_dt,ofns_desc,law_cat_cd,crm_atpt_cptd_cd,prem_typ_desc,latitude,longitude", // Only grab specific fields we actually need (Theres more field in the bottom of this page with the descriptions)

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

  const handleBookmark = (crime) => {
    // When a user clicks ‘Bookmark This,’ I pass in that specific crime object to this function.
    const payload = {
      // This creates the data object we're going to send to the backend.
      // Each field maps to what the /api/bookmarks backend expects:
      cmplntNum: crime.cmplnt_num, // cmplntNum comes directly from the crime object
      boroNm: crime.boro_nm,
      ofnsDesc: crime.ofns_desc,
      lawCatCd: crime.law_cat_cd,
      pdDesc: "N/A", // not included in the public API data, so we just send "N/A" for now
      latitude: parseFloat(crime.latitude), // latitude & longitude: converted from strings to numbers using parseFloat()
      longitude: parseFloat(crime.longitude),
      notes: "", // could later build a form to let users add custom notes
    };
    api
      .post("bookmarks", payload) // Sends a POST request to your backend at /api/bookmarks with the data we just built
      .then(() => alert("🔖 Bookmarked Successfully! 👍🏼")) // If the POST is successful, show a popup message to the user confirming it worked
      .catch((err) => {
        if (err.response?.status === 409) { // 409 Conflict: means the crime is already in your database, cmplntNum is unique
          alert("You already bookmarked this.");
        } else {
          console.error(
            "There was an error trying to bookmark the crime:",
            err
          );
          alert("Failed to bookmark.");
        }
      });
  };

  return (
    <div className="map-wrapper">
      <h1>🗺️ NYC Crime Map 🗽</h1>

      {loading ? ( // Ternary statement.
        <p>Loading Map..</p> // If the data hasn’t loaded yet, just show ‘Loading Map…’. Otherwise, render the interactive map.”
      ) : (
        <MapContainer // Using Leaflet’s MapContainer and setting it to center on NYC with a moderate zoom level.
          center={[40.7128, -74.006]} // Sets the map to New York City coordinates
          zoom={12} // Controls how zoomed in the map starts
          scrollWheelZoom={true} // Enables zooming with the mouse scroll wheel
        >
          <TileLayer // This pulls in the map background from OpenStreetMap, like how Google Maps loads its visual layers.
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' // attribution: legally required credit
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // defines how Leaflet pulls map visuals based on zoom level and position
          />
          {crimes.map(
            (
              crime // This loops through every crime in the crimes state.
            ) => (
              <Marker
                // For each crime that was loaded, lets place a marker on the map at the correct GPS coordinates.
                key={crime.cmplnt_num}
                position={[
                  parseFloat(crime.latitude), //  adds a marker (pin) on the map for each one using its latitude and longitude.
                  parseFloat(crime.longitude),
                ]}
              >
                <Popup>
                  {" "}
                  {/* This is what shows when a user clicks a pin on the map*/}
                  <strong>{crime.ofns_desc}</strong>
                  <br />
                  {crime.prem_typ_desc}
                  <br />
                  {/* Displays borough and just the date */}
                  {crime.boro_nm} — {crime.rpt_dt?.slice(0, 10)}
                  <br />
                  {crime.crm_atpt_cptd_cd}
                  <button onClick={() => handleBookmark(crime)}>
                    📌 Bookmark This
                  </button>
                </Popup>
              </Marker>
            )
          )}
        </MapContainer>
      )}
    </div>
  );
}

/*
========================
📌 NYC Crime API Fields
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
