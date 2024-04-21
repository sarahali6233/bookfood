import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  FormGroup,
} from "@mui/material";
import { useUser } from "./UserContext"; // Adjust the import as per your project structure

const Settings = () => {
  const { user, updateUserContext } = useUser();
  console.log("User from context in Settings:", user); // This will display the user object

  const [editMode, setEditMode] = useState(false); // Re-include this state

  // Initialize formData with user context data
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    // Don't actually fetch or display real passwords. This is a placeholder approach.
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    // Construct the payload, omitting confirmPassword and password if not provided
    const updateUserPayload = {
      username: formData.username,
      email: formData.email,
      ...(formData.password && { password: formData.password }),
    };

    try {
      const response = await fetch(
        `https://eu-api.backendless.com/45E67874-BB80-82AC-FF2C-42022EE86E00/DD57366F-CE14-42B8-AB3B-1B6854F269E9/data/bookfood_users/${user.objectId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Add authentication headers if required
          },
          body: JSON.stringify(updateUserPayload),
        }
      );

      if (!response.ok) throw new Error("Failed to update user information.");

      const updatedUserDetails = await response.json();
      updateUserContext(updatedUserDetails); // Update the global user context
      setEditMode(false);
      alert("User information updated successfully.");
    } catch (error) {
      console.error("Error updating user information:", error);
      alert("Error updating user information.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Account Management
          </Typography>
          {!editMode ? (
            <>
              <Typography>Username: {formData.username}</Typography>
              <Typography>Email: {formData.email}</Typography>
              <Typography>Password: ******</Typography>{" "}
              {/* Placeholder for password */}
              <Button onClick={() => setEditMode(true)}>Edit</Button>
            </>
          ) : (
            <FormGroup>
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                margin="normal"
                fullWidth
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                margin="normal"
                fullWidth
              />
              <TextField
                label="New Password"
                name="password"
                type="password"
                placeholder="Enter new password"
                value={formData.password}
                onChange={handleInputChange}
                margin="normal"
                fullWidth
              />
              <TextField
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                margin="normal"
                fullWidth
              />
              <Box
                sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
              >
                <Button variant="outlined" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </Button>
              </Box>
            </FormGroup>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;
