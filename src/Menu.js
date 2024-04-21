import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Container,
h
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ButtonGroup,
  Menu,
  MenuItem,
} from "@mui/material";
import { Alert } from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const MenuComponent = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const theme = useTheme();
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleClose(); // Close menu upon navigating
  };

  // Define handleLogout if not already defined
  const handleLogout = () => {
    // Example logout implementation
    localStorage.clear();
    navigate("/login");
  };

  const daysOfWeekOrder = {
    Montag: 1,
    Dienstag: 2,
    Mittwoch: 3,
    Donnerstag: 4,
    Freitag: 5,
  };

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(
          "https://eu-api.backendless.com/45E67874-BB80-82AC-FF2C-42022EE86E00/DD57366F-CE14-42B8-AB3B-1B6854F269E9/data/bookfood_menu_items"
        );
        if (!response.ok) throw new Error("Failed to fetch menu items");
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchMenuItems();
  }, []);

  const handleItemSelection = (itemId, size, day) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]:
        prev[itemId] && prev[itemId].size === size ? undefined : { size, day },
    }));
  };

  const getVariant = (itemId, size) => {
    return selectedItems[itemId] && selectedItems[itemId].size === size
      ? "contained"
      : "outlined";
  };

  // Helper function to get numerical value for sorting by day
  const getDayNumber = (dayName) => {
    return daysOfWeekOrder[dayName] || 0;
  };

  // Sort and group the menu items by day and type
  const sortMenuItems = (a, b) => {
    const dayOrderA = daysOfWeekOrder[a.dayofweek];
    const dayOrderB = daysOfWeekOrder[b.dayofweek];
    if (dayOrderA !== dayOrderB) return dayOrderA - dayOrderB;
    return a.foodtype.localeCompare(b.foodtype);
  };

  // Sorting and grouping menu items
  const groupedByDayAndType = menuItems
    .sort(sortMenuItems)
    .reduce((acc, item) => {
      const dayKey = item.dayofweek;
      const typeKey = item.foodtype;

      if (!acc[dayKey]) {
        acc[dayKey] = {};
      }
      if (!acc[dayKey][typeKey]) {
        acc[dayKey][typeKey] = [];
      }

      acc[dayKey][typeKey].push(item);
      return acc;
    }, {});

  const handleSubmitOrder = async () => {
    // Construct the order data including day, ID, and size for each item
    const orderData = Object.entries(selectedItems)
      .filter(([_, selection]) => selection !== undefined)
      .map(([itemId, { size, day }]) => {
        return { day, itemId, size };
      });

    // Group by day
    const ordersByDay = orderData.reduce((acc, item) => {
      if (!acc[item.day]) {
        acc[item.day] = [];
      }
      acc[item.day].push({ id: item.itemId, size: item.size });
      return acc;
    }, {});

    const finalOrderData = {
      chosenmenuitems: JSON.stringify(ordersByDay),
      ordereruserid: userData.id,
    };
    console.log("order data: ", finalOrderData);
    try {
      const response = await fetch(
        "https://eu-api.backendless.com/45E67874-BB80-82AC-FF2C-42022EE86E00/DD57366F-CE14-42B8-AB3B-1B6854F269E9/data/bookfood_orders",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalOrderData), // Send the final order data
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Reset the selected items on successful submission
      setSelectedItems({});

      // On successful submission:
      setSuccessMessage("Order submitted successfully!");
      setShowSuccessMessage(true);

      // Hide the success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to submit order:", error.message);
      alert("There was an error submitting your order.");
    }
  };

  const uniqueDays = [
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
  ]; // Assuming these are the only days you want to display

  // This will create an array of unique food types by looking at all menu items
  const uniqueTypes = [
    ...new Set(menuItems.map((item) => item.foodtype).filter(Boolean)),
  ];

  // This will group your sorted menu items by day and type
  const groupedMenuItems = menuItems.reduce((acc, item) => {
    const key = `${item.dayofweek}-${item.foodtype}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId"); // Replace with the correct way to retrieve the user ID
        const response = await fetch(
          `https://eu-api.backendless.com/45E67874-BB80-82AC-FF2C-42022EE86E00/DD57366F-CE14-42B8-AB3B-1B6854F269E9/data/bookfood_users/${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch user data");
        const userData = await response.json();
        localStorage.setItem("userData", JSON.stringify(userData));
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Container maxWidth={false} style={{ padding: theme.spacing(3) }}>
      {/* Conditionally render success message */}
      {showSuccessMessage && (
        <Alert severity="success" style={{ marginBottom: "20px" }}>
          {successMessage}
        </Alert>
      )}
      <Typography variant="h4" sx={{ mb: 4 }}>
        Menu
      </Typography>
      {/* Table for Displaying Menu Items */}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Day of Week</TableCell>
              {/* Dynamically generate table headers for each food type */}
              {uniqueTypes.map((type) => (
                <TableCell key={type}>{type}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Dynamically generate table rows for each day */}
            {uniqueDays.map((day) => (
              <TableRow key={day}>
                <TableCell>{day}</TableCell>
                {/* Fill in table cells based on the selected day and food type */}
                {uniqueTypes.map((type) => {
                  const item = groupedMenuItems[`${day}-${type}`]?.[0]; // Adjusted for simplified structure
                  return (
                    <TableCell key={type}>
                      {item ? (
                        <>
                          <Typography variant="body1">
                            {item.dishname}
                          </Typography>
                          <Typography variant="body2">
                            {item.dishprice
                              ? `${parseFloat(item.dishprice).toFixed(2)}€`
                              : "N/A"}
                          </Typography>
                          {/* Selection Buttons */}
                          <ButtonGroup
                            size="small"
                            aria-label="small outlined button group"
                          >
                            <Button
                              variant={getVariant(item.id, "Normal")}
                              onClick={() =>
                                handleItemSelection(
                                  item.id,
                                  "Normal",
                                  item.dayofweek
                                )
                              }
                            >
                              Normal
                            </Button>
                            <Button
                              variant={getVariant(item.id, "XL")}
                              onClick={() =>
                                handleItemSelection(
                                  item.id,
                                  "XL",
                                  item.dayofweek
                                )
                              }
                            >
                              XL
                            </Button>
                          </ButtonGroup>
                        </>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          No item
                        </Typography>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Submit Order Button */}
      <Button variant="contained" onClick={handleSubmitOrder} sx={{ mt: 2 }}>
        Submit Order
      </Button>
    </Container>
  );
};
export default MenuComponent;
