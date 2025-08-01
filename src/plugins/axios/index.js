// const { default: axios } = require("axios");
import axios from "axios"

const axiosIns = axios.create({
        baseURL: "http://localhost:4000/api/"
})

export default axiosIns;