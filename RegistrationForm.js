// RegistrationForm.js
import React, { useState } from "react";
import { Container, Typography, TextField, Button } from "@mui/material";

function RegistrationForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    // Send registration request to backend
    // Example:
    // fetch('your_registration_api_endpoint', {
    //   method: 'POST',
    //   body: JSON.stringify({ email, password }),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })
    // .then(response => response.json())
    // .then(data => {
    //   // Handle response
    // })
    // .catch(error => {
    //   // Handle error
    // });
  };

  return (
    <Container maxWidth="sm">
      <form noValidate>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleRegister}
        >
          Register
        </Button>
      </form>
    </Container>
  );
}

export default RegistrationForm;
