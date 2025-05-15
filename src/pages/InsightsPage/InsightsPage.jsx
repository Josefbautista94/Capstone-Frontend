import { useEffect, useState } from "react";
import nycCrimeApi from "../../api/nycCrimeApi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./InsightsPage.css";

export default function InsightsPage() {
//   const [selectedInsight, setSelectedInsight] = useState("offense");

//   const [data, setData] = useState([]);

//   const [premiseData, setPremiseData] = useState([]);

//   useEffect(() => {
//     nycCrimeApi
//       .get("", {
//         params: {
//           $limit: 500,
//           $order: "rpt_dt DESC",
//           $where: "latitude IS NOT NULL AND longitude IS NOT NULL",
//           $select: "ofns_desc,prem_typ_desc",
//         },
//       })
//       .then((res) => {
//         const counts = {};
//         res.data.forEach((crime) => {
//           const offense = crime.ofns_desc || "Unknown";
//           counts[offense] = (counts[offense] || 0) + 1;
//         });

//         const chartData = Object.entries(counts)
//           .sort((a, b) => b[1] - a[1]) // sort by the highest count
//           .slice(0, 5) // take top 5
//           .map(([name, count]) => ({ name, count }));

//         setData(chartData);

//         const premiseCounts = {};
//         res.data.forEach((crime) => {
//           const premise = crime.prem_typ_desc || "Unknown";
//           premiseCounts[premise] = (premiseCounts[premise] || 0) + 1;
//         });

//         const topPremises = Object.entries(premiseCounts)
//           .sort((a, b) => b[1] - a[1])
//           .slice(0, 5)
//           .map(([name, count]) => ({ name, count }));

//         setPremiseData(topPremises);
//       })
//       .catch((err) => console.error("Failed to load insight data:", err));
//   }, []);

  return (
    <div className="insights-container">
        <h1>Coming Soon</h1>
      {/* <h1>📊 Insights</h1>
      <div className="dropdown-wrapper">
        <label htmlFor="insight-select">Select Insight: </label>
        <select
          id="insight-select"
          value={selectedInsight}
          onChange={(e) => setSelectedInsight(e.target.value)}
        >
          <option value="offense">Top 5 Crime Types</option>
          <option value="premises">Top 5 Dangerous Premises</option>
        </select>
      </div>
      {selectedInsight === "offense" && (
        <>
          <h2 className="chart-title">Top 5 Most Common Crime Types</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#00bfff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
      {selectedInsight === "premises" && (
        <>
          <h2 className="chart-title">Top 5 Most Dangerous Premises</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={premiseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#ff4d4d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
       */}
    </div>
  );
}
