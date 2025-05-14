import axios from "axios";

const nycCrimeApi = axios.create({
    baseURL: "https://data.cityofnewyork.us/resource/5uac-w243.json",
    headers: {
      "X-App-Token": import.meta.env.VITE_APP_NYC_TOKEN
    }
  });
  

export default nycCrimeApi;