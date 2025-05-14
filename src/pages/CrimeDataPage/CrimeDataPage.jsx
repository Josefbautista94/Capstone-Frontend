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
