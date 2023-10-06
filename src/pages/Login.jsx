import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/joy/Typography";
import Api from "../services/Api.js";

const api = Api.getInstance();

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const getValidationErrorText = (key) => {
    if (Array.isArray(key)) {
      key.forEach((k) => {
        if (validationErrors[k]) {
          return Array.isArray(validationErrors[k])
            ? validationErrors[k][0]
            : validationErrors[k];
        }
      });
      return "";
    } else {
      return (validationErrors[key] && validationErrors[key][0]) || "";
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      attemptLogin();
    }
  };

  const attemptLogin = async () => {
    const data = { email, password };
    const response = await api.obtainTokens(data);
    if (response) {
      setValidationErrors(response);
    }
  };

  return (
    <Box
      sx={{
        mt: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 4,
          border: "1px solid rgba(0,0,0,0.15)",
          borderRadius: "8px",
        }}
      >
        <Typography level="h3">Login</Typography>
        <Box
          component="form"
          sx={{
            mt: 2,
            "& .MuiTextField-root": { m: 1 },
            display: "flex",
            flexDirection: "column",
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            required
            id="email-input"
            label="Email"
            size="small"
            style={{ marginLeft: 0, marginRight: 0 }}
            error={"email" in validationErrors || "detail" in validationErrors}
            helperText={
              getValidationErrorText("email") || validationErrors["detail"]
            }
            value={email}
            onChange={handleEmailChange}
          />
          <TextField
            required
            id="password-input"
            label="Password"
            size="small"
            type="password"
            style={{ marginLeft: 0, marginRight: 0 }}
            error={"password" in validationErrors}
            helperText={getValidationErrorText("password")}
            value={password}
            onChange={handlePasswordChange}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mt: 3,
          }}
        >
          <Button variant="contained" onClick={() => attemptLogin()}>
            Login
          </Button>

          <Link to={"/registration"}>
            <Button variant="outlined" color="secondary">
              Register
            </Button>
            <Typography
              variant="caption"
              sx={{ fontSize: "10px" }}
              display="block"
              gutterBottom
            >
              Don't have account?
            </Typography>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
