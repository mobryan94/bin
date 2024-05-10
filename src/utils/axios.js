import axios from "axios";
import store from "@/store";

let headers = {
  "content-type": "application/x-www-form-urlencoded",
};

// axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;

let user = window.localStorage.getItem("user") ? window.localStorage.getItem("user") : null;
if (user) headers["authorization"] = `Bearer ${user}`;

export default axios.create({ headers });
