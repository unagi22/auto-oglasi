import React, { useState, useEffect } from "react";
import api from "../services/Api";

export default function RegistrationForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("");

  const [countriesList, setCountriesList] = useState([]);

  

  useEffect(() => {
    const fetchCountriesList = async () => {
      try {
        const response = await api.get('/countries');
        setCountriesList(response.data.countries);
        
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
      // const api = new Api();
      // api.get('/countries')
      //   .then((data) => (console.log(data)))
      //   .catch((error) => (console.error("Error fetching countries:", error)));
  
      // try {
      //   const response = await fetch("http://fiscalibur.me/api/countries/");
      //   if (!response.ok) {
      //     throw new Error("Network response was not ok");
      //   }
      //   const data = await response.json();
      //   setCountriesList(data.countries);
      // } catch (error) {
      //   console.error("Error fetching countries:", error);
      // }
    };
    fetchCountriesList();
  }, []);

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };
  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };
  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const handleConfirmPassword = (event) => {
    handleConfirmPasswordChange(event);
    const value = event.target.value;
    if (value === password) console.log("matchy");
    console.log("not matchy");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // if (!isEmailGood(formData.email)) return;
    // if (!isNameGood(formData.name)) return;
    // if (!isPasswordGood(formData.password)) return;
    const body = JSON.stringify({firstName, lastName, email, password, country});

    console.log(body);
  };
  return (
    <div>
      <h1>Registration Form</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="first_name">First Name:</label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          value={firstName}
          onChange={handleFirstNameChange}
          required
        />
        <br />
        <br />

        <label htmlFor="last_name">Last Name:</label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          value={lastName}
          onChange={handleLastNameChange}
          required
        />
        <br />
        <br />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <br />
        <br />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <br />
        <br />

        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="confirmPassword"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleConfirmPassword}
          required
        />
        <br />
        <br />

        <label htmlFor="country">Country:</label>
        <select id="country" name="country" onChange={handleCountryChange}>
          {Object.entries(countriesList).map(([key, value], index) => {
            return (
              <option value={key} key={index}>
                {value}
              </option>
            );
          })}
        </select>
        <br />
        <br />

        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
