import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

function SignUpForm() {
  const navigate = useNavigate();
  const { resetUser } = useUser();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "student", // Default role
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format.";
    }
    if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const signUpUrl =
      "https://eu-api.backendless.com/45E67874-BB80-82AC-FF2C-42022EE86E00/DD57366F-CE14-42B8-AB3B-1B6854F269E9/data/bookfood_users";
    try {
      const response = await fetch(signUpUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          role: formData.role,
        }),
      });

      if (!response.ok) throw new Error("Sign-up failed.");

      resetUser();
      navigate("/login");
    } catch (error) {
      console.error("Error during sign up:", error);
      alert(error.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div
        style={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <form
          noValidate
          onSubmit={handleSubmit}
          style={{ width: "100%", marginTop: 3 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            error={!!formErrors.password}
            helperText={formErrors.password}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!formErrors.confirmPassword}
            helperText={formErrors.confirmPassword}
          />
          <FormControl component="fieldset" style={{ marginTop: 20 }}>
            <FormLabel component="legend">Role</FormLabel>
            <RadioGroup
              row
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <FormControlLabel
                value="student"
                control={<Radio />}
                label="Student"
              />
              <FormControlLabel
                value="admin"
                control={<Radio />}
                label="Admin"
              />
            </RadioGroup>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ margin: "24px 0 16px" }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <RouterLink
                to="/login"
                style={{ textDecoration: "none", color: "#0000EE" }}
              >
                Already have an account? Sign in
              </RouterLink>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

export default SignUpForm;
