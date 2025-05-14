import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"; //These are core map components from React Leaflet. I use MapContainer as the base map, TileLayer for the actual map visuals, and then Marker and Popup to place and describe each crime."
import nycCrimeApi from "../../api/nycCrimeApi";
import L from "leaflet"; // This lets me patch Leaflet’s default marker icon paths, which don’t work in Vite out of the box. Without this fix, the pins on the map wouldn't appear.
import "leaflet/dist/leaflet.css"; // Leaflet needs its own CSS file to display the map properly, so I load that globally.
import "./MapPage.css";

// Fix Leaflet's default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function MapPage() {
  const [crimes, setCrimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      .then((res) => setCrimes(res.data))
      .catch((err) =>
        console.error("There was an error fetching the crime data:", err)
      )
      .finally(() => setLoading(false));
  });

  return (
    <div className="map-wrapper">
      <h1>🗺️ NYC Crime Map 🗽</h1>
      {loading ? (
        <p>Loading Map..</p>
      ) : (
        <MapContainer
          center={[40.7128, -74.006]}
          zoom={12}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {crimes.map((crime) => (
            <Marker
              key={crime.cmplnt_num}
              position={[
                parseFloat(crime.latitude),
                parseFloat(crime.longitude),
              ]}
            >
              <Popup>
                <strong>{crime.ofns_desc}</strong>
                <br />
                {crime.prem_typ_desc}
                <br />
                {crime.boro_nm} — {crime.rpt_dt?.slice(0, 10)}
                <br/>
                {crime.crm_atpt_cptd_cd}
              </Popup>
            </Marker>
          ))}
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




