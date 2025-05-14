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
          $limit: 50,
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
          zoom={15}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {crimes.map((crime)=>(
            <Marker></Marker>

          ))}
        </MapContainer>
      )}
    </div>
  );
}
