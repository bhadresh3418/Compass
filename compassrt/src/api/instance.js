import axios from 'axios';
import env from "react-dotenv";

// This file contains base url and exporting instance

const getToken = () => {
    // code to get token
    const token = "slkhijasdbijuhsduaijkHDsahuidas";
    return token;
};

axios.defaults.headers.common["token"] = getToken();

const instance = axios.create({
  baseURL: env.API_BASE_URL || "http://localhost:9090/api",
});

export default instance;