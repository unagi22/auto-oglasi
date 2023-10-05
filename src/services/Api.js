import axios from 'axios';

const api = axios.create({
  baseURL: 'http://fiscalibur.me/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // If the error status is 401 and there is no originalRequest._retry flag,
//     // it means the token has expired and we need to refresh it
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const refreshToken = localStorage.getItem('refreshToken');
//         const response = await axios.post('/api/refresh-token', { refreshToken });
//         const { token } = response.data;

//         localStorage.setItem('token', token);

//         // Retry the original request with the new token
//         originalRequest.headers.Authorization = `Bearer ${token}`;
//         return axios(originalRequest);
//       } catch (error) {
//         // Handle refresh token error or redirect to login
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default api;



// class Api {
//   constructor(baseUrl = "http://fiscalibur.me/api") {
//     this.baseUrl = baseUrl;
//     this.refreshToken = null;
//     this.accessToken =
//       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjk2MDczMjQ4LCJpYXQiOjE2OTU5ODY4NDgsImp0aSI6IjUzZGFkODlmZDlkZjQwNjFhNTMzOTU2ZjYxZDFhYWM4IiwidXNlcl9pZCI6MX0.SR5HJoX2GFpHaVXTerPR9Tp3Pl4loalIpuzMy1vW1Hk";
//   }

//   getUrl(path) {
//     return this.baseUrl + path;
//   }

//   getCurrentToken() {
//     return this.accessToken;
//   }

//   setToken(newToken) {
//     this.accessToken = newToken;
//   }

//   async refreshAccessToken() {}

//   async obtainTokens() {}

//   getHeaders() {
//     if (this.accessToken) {
//       return {
//         // 'Content-Type': 'application/json',
//         // Accept: 'application/json',
//         Authorization: `Bearer ${this.getCurrentToken()}`,
//       };
//     }

//     return {};
//   }

//   get(path) {
//     console.log('this.getUrl(path)', this.getUrl(path))
//     return fetch(this.getUrl(path), {
//       method: "GET",
//       headers: this.getHeaders(),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         return response.json();
//       })
//       .catch((error) => {
//         console.log("error", error);
//       });
//   }

//   post(url, payload, headers = {}) {
//     const defaultHeaders = this.getHeaders();

//     // Convert the payload into FormData
//     const formData = new FormData();
//     console.log('payload', payload)
//     for (const key in payload) {
//       if (payload[key] !== undefined) { // Avoid adding undefined values
//         formData.append(key, payload[key]);
//       }
//     }

//     console.log('formData', formData)

//     return fetch(this.getUrl(url), {
//       method: "POST",
//       headers: new Headers({...defaultHeaders, ...headers}),
//       body: formData,
//     })
//   }
// }

// export default Api;
