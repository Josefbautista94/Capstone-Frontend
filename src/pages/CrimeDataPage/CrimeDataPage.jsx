import { useEffect, useState } from "react";
import nycCrimeApi from "../../api/nycCrimeApi"; // Custom Axios instance :)
import "./CrimeDataPage.css";

export default function CrimeDataPage() {
  // defining a react functional component and exporting it
  const [crimes, setCrimes] = useState([]); // crimes is an array to store the fetched arrest data, setCrimes is the function to update that array
  const [loading, setLoading] = useState(true); // loading is the boolean to track if the data is still loading, setLoading is the function to the change the loading state

  useEffect(() => {
    // useEffect lets us run side effects like API calls after render
    nycCrimeApi
      .get("", {
        params: {
          $limit: 500,
          $order: "rpt_dt DESC",
          $where: "latitude IS NOT NULL AND longitude IS NOT NULL",
          $select:
            "cmplnt_num,boro_nm,rpt_dt,ofns_desc,law_cat_cd,crm_atpt_cptd_cd,prem_typ_desc,latitude,longitude",
        },
      })

      // This fetches the most recent 500 crimes, sorted by date (most recent first)
      .then((res) => setCrimes(res.data)) // If the request succeeds, we store it in crimes by calling setCrimes(res.data)
      .catch(
        (err) => console.error("There was an error fetching the data:", err) // if the request fails we log the error to the console
      )
      .finally(() => setLoading(false)); // runs no matter what whether success or error, This sets loading to false so the UI knows it’s done loading
  }, []); // Runs once when the component mounts (because of [])

  const groupedByBorough = crimes.reduce((acc, crime) => {
    const boro = crime.boro_nm || "Unknown";
    if (!acc[boro]) acc[boro] = [];
    acc[boro].push(crime);
    return acc;
  }, {});

  return (
    // Wrapper container for the entire crime list section
    <div className="crime-list-wrapper">
      {/* Loop through each borough group using Object.entries (e.g., "Bronx": [...crimes]) */}
      {Object.entries(groupedByBorough).map(([borough, crimes]) => (
        // Each borough gets its own section
        <div key={borough} className="borough-section">
          {/* Borough title */}
          <h2>{borough}</h2>

          {/* List of crimes for this borough */}
          <ul className="crime-list">
            {/* Loop through each crime in the current borough */}
            {crimes.map((crime, index) => (
              <li
                key={index}
                className="crime-card"
                style={{ cursor: "default" }} // Disable pointer cursor to show it's not clickable
              >
                {/* Crime offense description */}
                <h3>{crime.ofns_desc || "Unknown Offense"}</h3>

                {/* Law category (e.g., FELONY, MISDEMEANOR) */}
                <p>
                  <strong>Category:</strong> {crime.law_cat_cd || "N/A"}
                </p>

                {/* Completion status (Attempted or Completed) */}
                <p>
                  <strong>Status:</strong> {crime.crm_atpt_cptd_cd || "N/A"}
                </p>

                {/* General location info */}
                <p>
                  <strong>Location:</strong> {crime.prem_typ_desc || "Unknown"}{" "}
                  — {crime.loc_of_occur_desc || "N/A"}
                </p>

                {/* Borough name (should match the group heading) */}
                <p>
                  <strong>Borough:</strong> {crime.boro_nm || "Unknown"}
                </p>

                {/* Reported date (formatted to show YYYY-MM-DD only) */}
                <p>
                  <strong>Reported:</strong>{" "}
                  {crime.rpt_dt?.slice(0, 10) || "Unknown Date"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
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
