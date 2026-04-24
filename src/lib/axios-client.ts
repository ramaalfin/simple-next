import axios from "axios";

const options = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
};

const API = axios.create(options);

export default API;
