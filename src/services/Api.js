class Api {
  constructor(baseUrl = "http://localhost:8000/api") {
    this.baseUrl = baseUrl;
    this.isAuthenticated = false;
    this.isSuperuser = false;
  }

  static instance;

  static getInstance() {
    if (!Api.instance) {
      Api.instance = new Api();
    }

    let accessToken = Api.instance.getAccessToken();
    if (accessToken) {
      Api.instance.isAuthenticated = true;
      const tokenData = JSON.parse(atob(accessToken.split('.')[1]))
      if (tokenData.is_superuser !== Api.instance.isSuperuser) {
        Api.instance.isSuperuser = tokenData.is_superuser;
      }
    } else {
      Api.instance.isAuthenticated = false;
    }

    return Api.instance;
  }

  getUrl(path) {
    return this.baseUrl + path;
  }

  storeAccessToken(token) {
    window.localStorage.setItem('accessToken', token);
  }

  storeRefreshToken(token) {
    window.localStorage.setItem('refreshToken', token);
  }

  removeAccessToken() {
    window.localStorage.removeItem('accessToken');
  }

  removeRefreshToken() {
    window.localStorage.removeItem('refreshToken');
  }

  getAccessToken() {
    return window.localStorage.getItem('accessToken');
  }

  getRefreshToken() {
    return window.localStorage.getItem('refreshToken');
  }

  async refreshAccessToken() {
    const response = await fetch(this.getUrl('/token/refresh/'), {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: this.getRefreshToken()
      }),
    });

    const data = await response.json();
    if (data.access) {
      this.storeAccessToken(data.access);
      return data.access;
    }
    return null;
  }

  async obtainTokens(data) {
    return this.post('/token/', JSON.stringify(data), {
      'Content-Type': 'application/json',
    })
        .then(async (response) => {
          console.log('response.staus', response.status)
          const responseData = await response.json();
          if (response.status === 200) {
            const { access, refresh} = responseData;
            this.storeAccessToken(access);
            this.storeRefreshToken(refresh);
            this.isAuthenticated = true;

            window.location.href = '/';
          } else if ([400, 401].includes(response.status)) {
            // setValidationErrors(responseData)
            console.error("Error on login:", responseData);
            // throw new Error('Invalid credentials')
            return responseData;
          }
        })
  }

  async logout () {
    const refresh = this.getRefreshToken();
    const data = { refresh }
    this.post('/token/blacklist/', JSON.stringify(data), {
      'Content-Type': 'application/json',
    })
        .then(async (response) => {
          const responseData = await response.json();
          if (response.status === 200) {
            Api.instance.removeAccessToken();
            Api.instance.removeRefreshToken();
            Api.instance.isAuthenticated = false;

            window.location.href = '/';
          } else if (response.status === 400) {
            console.error("Error adding car data:", responseData);
          }
        })
  }

  getHeaders() {
    if (this.getAccessToken()) {
      return {
        Authorization: `Bearer ${this.getAccessToken()}`,
      };
    }

    return {};
  }

  async fetchWithTokenRefresh(method, url, options = {}) {
    let response = await fetch(this.getUrl(url), {
      method: method,
      headers: this.getHeaders(),
      ...options
    });

    if (response.status === 401 && url !== '/token/') {
      console.log('Access token expired');
      try {
        const newToken = await this.refreshAccessToken();
        if (!newToken) {
          throw new Error("Unable to refresh access token.");
        }

        response = await fetch(this.getUrl(url), {
          method: method,
          headers: this.getHeaders(),
          ...options
        });
      } catch (error) {
        console.error("Error during token refresh:", error.message);
        // Remove invalid tokens
        this.removeRefreshToken();
        this.removeAccessToken();
        window.location.href = '/login';
        // throw new Error("Session expired. Redirecting to login.");
      }
    }

    return response;
  }

  async get(path) {
    const response = await this.fetchWithTokenRefresh("GET", path);
    if (!response.ok) {
      throw new Error("Network response was not ok1");
    }

    return response.json();
  }

  post(url, payload = {}, headers = {}) {
    return this.fetchWithTokenRefresh("POST", url, {
      headers: new Headers({ ...this.getHeaders(), ...headers }),
      body: payload,
    });
  }

  patch(url, payload = {}, headers = {}) {
    return this.fetchWithTokenRefresh("PATCH", url, {
      headers: new Headers({ ...this.getHeaders(), ...headers }),
      body: payload,
    });
  }

  delete(url) {
    return this.fetchWithTokenRefresh("DELETE", url);
  }
}

export default Api;
