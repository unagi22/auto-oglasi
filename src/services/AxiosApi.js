import axios from 'axios';

const axiosApi = axios.create({
    baseURL: 'http://fiscalibur.me/api/', // 'http://127.0.0.1:8000/api/'
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosApi;
