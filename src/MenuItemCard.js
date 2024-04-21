import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
} from "@mui/material";

/**
 * MenuItemCard Component
 * @param {Object} props - Component props
 * @param {Object} props.item - The menu item data
 * @param {boolean} props.isAdmin - Flag to indicate if the current user is an admin
 * @param {Function} props.onUpdate - Function to call when an update is made
 */
const MenuItemCard = ({ item, isAdmin, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false); // Tracks whether the card is in edit mode
  const [editItem, setEditItem] = useState(item); // Holds the editable values of the menu item

  // Toggles the edit mode
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Updates the state with changes to the editable fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditItem({ ...editItem, [name]: value });
  };

  // Calls the onUpdate prop with the updated item and exits edit mode
  const handleUpdateClick = () => {
    onUpdate(editItem);
    setIsEditing(false);
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        {isEditing ? (
          // Edit mode: display text fields for editing
          <>
            <TextField
              fullWidth
              variant="outlined"
              margin="dense"
              label="Dish Name"
              name="dishname"
              value={editItem.dishname}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              variant="outlined"
              margin="dense"
              label="Price"
              name="dishprice"
              value={editItem.dishprice}
              onChange={handleChange}
            />
            <Button
              color="primary"
              variant="contained"
              onClick={handleUpdateClick}
            >
              Update
            </Button>
            <Button color="secondary" onClick={handleEditToggle}>
              Cancel
            </Button>
          </>
        ) : (
          // View mode: display the item's data
          <>
            <Typography variant="h6">{item.dishname}</Typography>
            <Typography color="textSecondary">
              Price: {item.dishprice}
            </Typography>
            {isAdmin && (
              <Button color="secondary" onClick={handleEditToggle}>
                Edit
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MenuItemCard;
