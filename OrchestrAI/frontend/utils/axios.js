import axios from "axios"

const api = axios.create({
    baseURL:import.meta.env.VITE_SERVER_URL,
    withCredentials:true//this is useful for when we pass cookies then we must do it with credentials 
})

export default api;