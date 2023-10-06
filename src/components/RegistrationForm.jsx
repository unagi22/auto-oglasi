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
  Box,
  Typography,
  Grid,
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
  const [screenSize, setScreenSize] = useState(getCurrentDimension());
  const [registrationSuccess, setRegistrationSuccess] = useState(null);

  function getCurrentDimension() {
    return window.innerWidth;
  }

  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension());
    };
    window.addEventListener("resize", updateDimension);

    return () => {
      window.removeEventListener("resize", updateDimension);
    };
  }, [screenSize]);

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
      setRegistrationSuccess(
        "Registration submited, check your email for confirmation"
      );
    } catch (error) {
      console.log("Registration failed:", error);
    }
  };

  return (
    <Box
      sx={{
        mx: "auto",
        my: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        px: 2,
        py: 4,
        border: "1px solid rgba(0,0,0,0.15)",
        borderRadius: "8px",
        width: { xs: "80vw", sm: "50vw" },
      }}
    >
      <Typography level="h3">Registration</Typography>
      <Box
        component="form"
        sx={{
          mt: 2,
        }}
        noValidate
        autoComplete="off"
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="First Name"
              name="firstName"
              value={first_name}
              onChange={handleFirstNameChange}
              size="small"
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <AccountCircle color="primary" />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="Last Name"
              name="lastName"
              value={last_name}
              onChange={handleLastNameChange}
              size="small"
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <AccountCircle color="primary" />,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              size="small"
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <Email color="primary" />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              size="small"
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <Lock color="primary" />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={confirm_password}
              onChange={handleConfirmPasswordChange}
              size="small"
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <Lock color="primary" />,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small" variant="outlined">
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
          </Grid>
        </Grid>
      </Box>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 2 }}
      >
        Register
      </Button>
      {registrationSuccess && (
        <Typography mt={2}>{registrationSuccess}</Typography>
      )}
    </Box>
  );
}
