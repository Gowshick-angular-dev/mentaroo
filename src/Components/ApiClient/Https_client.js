import axios from "axios"

export const baseUrl = process.env.REACT_APP_BASE_URL

const MainApi = axios.create({
    baseURL: baseUrl
})

MainApi.interceptors.request.use((config) => {
    let token = undefined
    let hostname = process.env.REACT_CLIENT_HOST_URL;
    
    if (typeof window !== 'undefined'){
        // token = localStorage.getItem('token');
        hostname = window.location.hostname;
    }

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config
    
},(error) => {
    return Promise.reject(error);
})


// Response interceptor
MainApi.interceptors.response.use(  
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default MainApi