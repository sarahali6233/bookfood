import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Button } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import RestaurantIcon from "@mui/icons-material/Restaurant"; // Fork and Knife icon for food-related navigation
import SettingsIcon from "@mui/icons-material/Settings";
import ListAltIcon from "@mui/icons-material/ListAlt";
import EditIcon from "@mui/icons-material/Edit"; // Icon for editing
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

const TopAppBar = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleSignOut = () => {
    localStorage.removeItem("userSession"); // Adjust according to your logout logic
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {user ? `${user.username} (${user.role})` : "Welcome Guest"}
        </Typography>

        <IconButton
          color="inherit"
          onClick={() =>
            handleNavigate(
              user && user.role === "admin" ? "/edit-menu" : "/menu"
            )
          }
        >
          <RestaurantIcon />
        </IconButton>

        {/* Orders Overview Icon - Only for Admin */}
        {user && user.role === "admin" && (
          <IconButton color="inherit" onClick={() => handleNavigate("/orders")}>
            <ListAltIcon />
          </IconButton>
        )}

        {/* Profile Icon */}
        <IconButton color="inherit" onClick={() => handleNavigate("/profile")}>
          <AccountCircleIcon />
        </IconButton>

        {/* Settings Icon */}
        <IconButton color="inherit" onClick={() => handleNavigate("/settings")}>
          <SettingsIcon />
        </IconButton>

        {/* Log Out Button */}
        <Button color="inherit" onClick={handleSignOut}>
          Log Out
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopAppBar;
