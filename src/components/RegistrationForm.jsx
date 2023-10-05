import React, { useState, useEffect } from "react";
import AxiosApi from "../services/AxiosApi";
import { isRegistrationValid } from "../utils/validationFunctions";
import {
  TextField,
  Button,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { AccountCircle, Email, Lock } from "@mui/icons-material";

export default function RegistrationForm() {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("");

  const [countriesList, setCountriesList] = useState([]);

  useEffect(() => {
    const fetchCountriesList = async () => {
      try {
        const response = await AxiosApi.get("countries/");
        setCountriesList(response.data.countries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    // if (isRegistrationValid(email, password, confirm_password)) {
      try {
        const data = JSON.stringify({
          first_name,
          last_name,
          email,
          password,
          country,
        });
        const response = await AxiosApi.post("register/", data);
        console.log("Registration successful:", response.data);
      } catch (error) {
        console.log("Registration failed:", error);
      }
    // } else console.log("data not valid");
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <TextField
          label="First Name"
          name="firstName"
          value={first_name}
          onChange={handleFirstNameChange}
          fullWidth
          margin="normal"
          variant="outlined"
          InputProps={{
            startAdornment: <AccountCircle color="primary" />,
          }}
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={last_name}
          onChange={handleLastNameChange}
          fullWidth
          margin="normal"
          variant="outlined"
          InputProps={{
            startAdornment: <AccountCircle color="primary" />,
          }}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          fullWidth
          margin="normal"
          variant="outlined"
          InputProps={{
            startAdornment: <Email color="primary" />,
          }}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          fullWidth
          margin="normal"
          variant="outlined"
          InputProps={{
            startAdornment: <Lock color="primary" />,
          }}
        />
        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={confirm_password}
          onChange={handleConfirmPasswordChange}
          fullWidth
          margin="normal"
          variant="outlined"
          InputProps={{
            startAdornment: <Lock color="primary" />,
          }}
        />
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel>Country</InputLabel>
          <Select
            label="Country"
            name="country"
            value={country}
            onChange={handleCountryChange}
          >
            {Object.entries(countriesList).map(([key, value], index) => {
              return (
                <MenuItem key={index} value={key}>
                  {value}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          style={{ marginTop: "16px" }}
        >
          Register
        </Button>
      </form>
    </Container>
  );
}
