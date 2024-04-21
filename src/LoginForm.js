import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  FormHelperText,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

function LoginForm() {
  const navigate = useNavigate();
  const { updateUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const customLogin = async (email, password) => {
    setErrorMessage(""); // Clear any previous error messages

    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    const loginUrl = `https://eu-api.backendless.com/45E67874-BB80-82AC-FF2C-42022EE86E00/DD57366F-CE14-42B8-AB3B-1B6854F269E9/data/bookfood_users?where=Email%3D'${encodeURIComponent(
      email
    )}'`;

    try {
      const response = await fetch(loginUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed.");
      }

      const users = await response.json();

      if (users.length > 0 && users[0].Password === password) {
        const userData = {
          username: users[0].Username,
          role: users[0].Role,
          objectId: users[0].objectId,
          email: users[0].Email,
        };

        updateUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/dashboard");
      } else {
        setErrorMessage("Incorrect email or password.");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      setErrorMessage(error.message || "Failed to login.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    customLogin(email, password);
  };

  return (
    <Container component="main" maxWidth="xs">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorMessage && (
            <FormHelperText style={{ color: "red", marginTop: 8 }}>
              {errorMessage}
            </FormHelperText>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: 16 }}
          >
            Sign In
          </Button>
          <Grid container style={{ marginTop: 8 }}>
            <Grid item xs>
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
              >
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

export default LoginForm;
