import axios from 'axios';
import env from "react-dotenv";

// This file contains base url and exporting instance

// const getToken = () => localStorage.getItem('token');
// axios.defaults.headers.common["x-access-token"] = getToken();
const instance = axios.create({ baseURL: env.API_BASE_URL || "http://localhost:9090/api", });
export default instance;