import axios from "axios";

const nycCrimeApi = axios.create({
    baseURL : "https://data.cityofnewyork.us/resource/qb7u-rbmr.json",
});

export default nycCrimeApi;