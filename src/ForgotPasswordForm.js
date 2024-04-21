import React, { useState } from "react";
import { Container, Typography, TextField, Button, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  // Your theme customization
});

const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  submitButton: {},
}));

function ForgotPasswordForm() {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleForgotPassword(e) {
    e.preventDefault();
    // Placeholder for Backendless Forgot Password API call
    const apiURL = `https://api.backendless.com/45E67874-BB80-82AC-FF2C-42022EE86E00/DD57366F-CE14-42B8-AB3B-1B6854F269E9/users/restorepassword/${encodeURIComponent(
      email
    )}`;

    try {
      const response = await fetch(apiURL, {
        method: "POST", // The method might vary based on Backendless API requirements
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setMessage("Please check your email for password reset instructions.");
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to request password reset."
        );
      }
    } catch (error) {
      console.error("Forgot password error:", error.message);
      setMessage(error.message || "Failed to request password reset.");
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.formContainer}>
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <form noValidate onSubmit={handleForgotPassword}>
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submitButton}
          >
            Send Reset Link
          </Button>
          {message && <Typography color="textSecondary">{message}</Typography>}
          <Grid container>
            <Grid item>
              <RouterLink
                to="/login"
                style={{ textDecoration: "none", marginTop: "8px" }}
              >
                Back to login
              </RouterLink>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

export default ForgotPasswordForm;
