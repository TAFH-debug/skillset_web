import axios from "axios";

export const sieveAxios = axios.create({
    baseURL: "https://mango.sievedata.com/v2",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SIEVE_API_KEY}`
    },
});

sieveAxios.interceptors.request.use(async (config) => {
    config.headers['X-API-Key'] = process.env.SIEVE_API_KEY;
    return config;
});
