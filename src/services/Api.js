class Api {
  constructor(baseUrl = "http://localhost:8000/api") {
    this.baseUrl = baseUrl;
    this.refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY5NjUzODk0MywiaWF0IjoxNjk2MzY2MTQzLCJqdGkiOiI1MjNlZGM5ZTNmNTg0OWJlOGQ5YTcyY2FhYWQ2ZGM5MCIsInVzZXJfaWQiOjE5LCJpc19zdXBlcnVzZXIiOnRydWV9.gWokPz_C9OL-dGEZFkrW8bCDDfMW2neCVhsXl-llf4A';
    this.isSuperuser = false;
  }

  static instance;

  static getInstance() {
    if (!Api.instance) {
      Api.instance = new Api();
    }

    let accessToken = Api.instance.getCurrentToken();
    if (accessToken) {
      const tokenData = JSON.parse(atob(accessToken.split('.')[1]))
      if (tokenData.is_superuser !== Api.instance.isSuperuser) {
        Api.instance.isSuperuser = tokenData.is_superuser;
      }
    }

    return Api.instance;
  }

  getUrl(path) {
    return this.baseUrl + path;
  }

  storeToken(token) {
    window.localStorage.setItem('accessToken', token);
  }

  removeToken() {
    window.localStorage.removeItem('accessToken');
  }

  getCurrentToken() {
    return window.localStorage.getItem('accessToken');
  }

  async refreshAccessToken() {
    const response = await fetch(this.getUrl('/token/refresh/'), {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: this.refreshToken
      }),
    });

    const data = await response.json();
    if (data.access) {
      this.storeToken(data.access);
      return data.access;
    }
    return null;
  }

  async obtainTokens() {}

  getHeaders() {
    if (this.getCurrentToken()) {
      return {
        Authorization: `Bearer ${this.getCurrentToken()}`,
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

    if (response.status === 401) {
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
        this.removeToken();
        // Assuming you're using something like react-router or a similar routing library:
        window.location.href = '/login';

        throw new Error("Session expired. Redirecting to login.");
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
