import { useEffect, useState } from "react";
import nycCrimeApi from "../../api/nycCrimeApi"; // Custom Axios instance :)

export default function CrimeDataPage() { // defining a react functional component and exporting it
  const [crimes, setCrimes] = useState([]); // crimes is an array to store the fetched arrest data, setCrimes is the function to update that array
  const [loading, setLoading] = useState(true); // loading is the boolean to track if the data is still loading, setLoading is the function to the change the loading state

  useEffect(() => { // useEffect lets us run side effects like API calls after render
    nycCrimeApi.get("", {
      params: {
        $limit: 100,
        $order: "rpt_dt DESC",
        $where: "latitude IS NOT NULL AND longitude IS NOT NULL",
        $select: "cmplnt_num,boro_nm,rpt_dt,ofns_desc,law_cat_cd,crm_atpt_cptd_cd,prem_typ_desc,latitude,longitude"
      }
    })
    
    // This fetches the most recent 100 arrests, sorted by date (most recent first)
      .then((res) => setCrimes(res.data)) // If the request succeeds, we store it in crimes by calling setCrimes(res.data)
      .catch((err) => 
        console.error("There was an error fetching the data:", err) // if the request fails we log the error to the console
      )
      .finally(() => setLoading(false)); // runs no matter what whether success or error, This set the loading to false so the UI knows that its done loading
  }, []); // Runs once when the component mounts (because of [])


 return (
    <div>
      <h1>📊 Live NYC Arrest Data</h1>
      {loading ? ( // If loading is true, show <p>Loading...</p>. Otherwise, show the list of crimes.
        <p>Loading...</p>
      ) : (
        <ul>
          {crimes.map((crime, index) => ( //  loops through each arrest in your crimes array.
          // Uses index as the React key 
            <li key={index}> 
              <strong>{crime.ofns_desc || "Unknown Offense"}</strong> —{" "} {/* displays the offense decription*/}
              {crime.boro_nm || "Unknown Borough"} on{" "} {/* Shows the borough*/}
              {crime.cmplnt_fr_dt?.slice(0, 10) || "Unknown Date"} {" "}{/* Displays the arrest date*/}
              {crime.prem_typ_desc || "No Location Decription Avaliable"}
            </li>
          ))}
        </ul>
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

