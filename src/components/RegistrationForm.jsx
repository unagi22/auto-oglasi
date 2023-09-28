import React, { useState, useEffect } from "react";

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
  });

  const [countries, setCountries] = useState([]);

  const fetchCountries = async () => {
    try {
      const response = await fetch("http://fiscalibur.me/api/countries/");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCountries(data.countries);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };
  useEffect(() => {
    fetchCountries();
  }, []);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleConfirmPassword = (event) => {
    handleChange(event);
    const value = event.target.value;
    if (value === formData.password) console.log("matchy");
    console.log("not matchy");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // if (!isEmailGood(formData.email)) return;
    // if (!isNameGood(formData.name)) return;
    // if (!isPasswordGood(formData.password)) return;

    submitForm(formData);
    console.log("hi");
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
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <label htmlFor="last_name">Last Name:</label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="confirmPassword"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleConfirmPassword}
          required
        />
        <br />
        <br />

        <label htmlFor="country">Country:</label>
        <select id="country" name="country" onChange={handleChange}>
          {Object.entries(countries).map(([key, value], index) => {
            return (
              <option value={key} key={index}>
                {value}
              </option>
            );
          })}
        </select>
        <br />
        <br />

        <input type="submit" value="Submit"/>
      </form>
    </div>
  );
}
