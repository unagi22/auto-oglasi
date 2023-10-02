class Api {
  constructor(baseUrl = "http://localhost:8000/api") {
    this.baseUrl = baseUrl;
    this.refreshToken = null;
    this.isSuperuser = false;
  }

  static instance;

  static getInstance() {
    if (!Api.instance) {
      Api.instance = new Api();
    }

    Api.instance.removeToken()
    // if (!Api.instance.getCurrentToken()) {
    const accessTokenValue = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjk2MzUyODY2LCJpYXQiOjE2OTYyNjY0NjYsImp0aSI6IjhmZWU1ZTI2NGNlNTQzZjg5ZDlkYjk4MjBmYTlkODRiIiwidXNlcl9pZCI6MTksImlzX3N1cGVydXNlciI6ZmFsc2V9.qFewxzrlOoGcgcSl2Hy6vFWZDRI9o24JWL6YHlac_hY';
    Api.instance.storeToken(accessTokenValue);
    // }

    if (!accessTokenValue) {
      return null;
    }
    const tokenData = JSON.parse(atob(accessTokenValue.split('.')[1]))
    if (tokenData.is_superuser !== Api.instance.isSuperuser) {
      Api.instance.isSuperuser = tokenData.is_superuser;
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

  async refreshAccessToken() {}

  async obtainTokens() {}

  getHeaders() {
    if (this.getCurrentToken()) {
      return {
        Authorization: `Bearer ${this.getCurrentToken()}`,
      };
    }

    return {};
  }

  get(path) {
    return fetch(this.getUrl(path), {
      method: "GET",
      headers: this.getHeaders(),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  post(url, payload = {}, headers = {}) {
    const defaultHeaders = this.getHeaders();

    return fetch(this.getUrl(url), {
      method: "POST",
      headers: new Headers({...defaultHeaders, ...headers}),
      body: payload,
    })
  }

  delete(url) {
    return fetch(this.getUrl(url), {
      method: "DELETE",
      headers: new Headers(this.getHeaders()),
    })
  }
}

export default Api;
