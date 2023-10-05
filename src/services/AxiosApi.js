import axios from 'axios';

const axiosApi = axios.create({
    baseURL: 'http://fiscalibur.me/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosApi;
