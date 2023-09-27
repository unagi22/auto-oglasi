// Api.js
class Api {
  constructor(path, baseUrl = "http://fiscalibur.me/api") {
    this.baseUrl = baseUrl;
    this.path = path;
    this.refreshToken = null;
    this.accessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjk1OTIzNTczLCJpYXQiOjE2OTU4MzcxNzMsImp0aSI6IjEyMzJkMzI1MDkxYjRiOWQ4NDFiMTAxMGVjN2M3MjlkIiwidXNlcl9pZCI6MX0.g9twmjaD22mYAlz3tYCS0AR8sn0THhoVFObTlynKB7U";
  }

  getUrl() {
    return this.baseUrl + this.path;
  }

  getCurrentToken() {
    return this.accessToken;
  }

  setToken(newToken) {
    this.accessToken = newToken;
  }

  async refreshAccessToken() {}

  async obtainTokens() {}

  getHeaders() {
    if (this.accessToken) {
      return new Headers({
        Authorization: `Bearer ${this.getCurrentToken()}`,
      });
    }

    return {};
  }

  get() {
    return fetch(this.getUrl(), {
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

  post() {
    return fetch(this.getUrl(), {
      method: "POST",
      headers: this.getHeaders(),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    });
  }
}

export default Api;
