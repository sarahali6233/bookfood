import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Button,
  Paper,
  IconButton,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useUser } from "./UserContext";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EditMenuComponent = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const fetchMenuItems = async () => {
      // Ensure the URL and headers are correct for your backend
      const response = await fetch(
        "https://eu-api.backendless.com/45E67874-BB80-82AC-FF2C-42022EE86E00/DD57366F-CE14-42B8-AB3B-1B6854F269E9/data/bookfood_menu_items"
      );
      if (response.ok) {
        const data = await response.json();
        // Ensure the data structure is correctly set for your state
        setMenuItems(data);
      } else {
        console.error("Failed to fetch menu items");
      }
    };

    if (user && user.role === "admin") {
      fetchMenuItems();
    }
  }, [user]);

  const handleSaveChanges = async () => {
    for (let item of menuItems) {
      const method = item.objectId ? "PUT" : "POST";
      const url = item.objectId
        ? `https://eu-api.backendless.com/45E67874-BB80-82AC-FF2C-42022EE86E00/DD57366F-CE14-42B8-AB3B-1B6854F269E9/data/bookfood_menu_items/${item.objectId}`
        : "https://eu-api.backendless.com/45E67874-BB80-82AC-FF2C-42022EE86E00/DD57366F-CE14-42B8-AB3B-1B6854F269E9/data/bookfood_menu_items";
      try {
        const response = await fetch(url, {
          method: method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });

        if (!response.ok) {
          throw new Error("Failed to save menu item changes.");
        }
      } catch (error) {
        console.error("Error saving menu item changes:", error);
        return;
      }
    }

    setOpenSnackbar(true);
  };

  const handleChange = (index, field, value) => {
    const updatedItems = [...menuItems];
    updatedItems[index][field] = value;
    setMenuItems(updatedItems);
  };

  const addNewItem = () => {
    setMenuItems([
      ...menuItems,
      { dishname: "", dishprice: "", dayofweek: "", foodtype: "" },
    ]);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="md">
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Dish Name</TableCell>
              <TableCell>Price (€)</TableCell>
              <TableCell>Day of Week</TableCell>
              <TableCell>Food Type</TableCell>
            </TableRow>
            {menuItems.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    fullWidth
                    value={row.dishname}
                    onChange={(e) =>
                      handleChange(index, "dishname", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    type="number"
                    value={row.dishprice}
                    onChange={(e) =>
                      handleChange(
                        index,
                        "dishprice",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    value={row.dayofweek}
                    onChange={(e) =>
                      handleChange(index, "dayofweek", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    value={row.foodtype}
                    onChange={(e) =>
                      handleChange(index, "foodtype", e.target.value)
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={4}>
                <IconButton onClick={addNewItem}>
                  <AddCircleIcon color="primary" />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSaveChanges}
        style={{ marginTop: "20px" }}
      >
        Save Changes
      </Button>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Menu updated successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditMenuComponent;
