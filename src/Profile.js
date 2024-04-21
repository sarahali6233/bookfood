import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Avatar,
  Box,
  Checkbox,
  FormControlLabel,
  Container,
  Chip,
  Paper,
  IconButton,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useUser } from "./UserContext";

const ingredientsList = [
  "Milk products/Lactose",
  "Gluten",
  "Eggs",
  "Soya",
  "Peanuts",
  "Shellfish",
  "Mustard",
  "Fish",
  "Sesame",
  "Pig meat",
  "Pepper",
  "Sugar",
  "Vegan",
  "Vegetarian",
];

function Profile() {
  const { user, updateUser } = useUser();
  const [isEditMode, setIsEditMode] = useState(false);
  const [bio, setBio] = useState(user?.Bio || "");
  const [profilePic, setProfilePic] = useState(user?.ProfilepictureURL || "");
  const [unwantedIngredients, setUnwantedIngredients] = useState(
    user?.UnwantedIngredients || []
  );
  const [likes, setLikes] = useState(user?.Likes || []);
  const [dislikes, setDislikes] = useState(user?.Dislikes || []);
  const [newLike, setNewLike] = useState("");
  const [newDislike, setNewDislike] = useState("");

  useEffect(() => {
    if (user) {
      setBio(user.Bio || "");
      setProfilePic(user.ProfilepictureURL || "");
      setUnwantedIngredients(user.UnwantedIngredients || []);
      setLikes(user.Likes || []);
      setDislikes(user.Dislikes || []);
      const savedProfilePic = sessionStorage.getItem("profilePic");
      if (savedProfilePic) {
        setProfilePic(savedProfilePic);
      }
    }
  }, [user]);

  const handleCancel = () => {
    setIsEditMode(false);
    setBio(user?.Bio || "");
    setProfilePic(user?.ProfilepictureURL || "");
    setUnwantedIngredients(user?.UnwantedIngredients || []);
  };

  const handleBioChange = (e) => setBio(e.target.value);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const localImageUrl = URL.createObjectURL(file);
      setProfilePic(localImageUrl);
      // Save the local URL in sessionStorage
      sessionStorage.setItem("profilePic", localImageUrl);
    }
  };

  const handleUnwantedIngredientChange = (ingredient) => (e) => {
    const updatedIngredients = e.target.checked
      ? [...unwantedIngredients, ingredient]
      : unwantedIngredients.filter((item) => item !== ingredient);
    setUnwantedIngredients(updatedIngredients);
  };

  const handleAddLike = () => {
    if (newLike && !likes.includes(newLike)) {
      setLikes([...likes, newLike]);
      setNewLike("");
    }
  };

  const handleRemoveLike = (like) => {
    setLikes(likes.filter((l) => l !== like));
  };

  const handleAddDislike = () => {
    if (newDislike && !dislikes.includes(newDislike)) {
      setDislikes([...dislikes, newDislike]);
      setNewDislike("");
    }
  };

  const handleRemoveDislike = (dislike) => {
    setDislikes(dislikes.filter((d) => d !== dislike));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedUserData = {
      Bio: bio,
      ProfilepictureURL: profilePic,
      UnwantedIngredients: unwantedIngredients,
      Likes: likes, // Ensure this is in the format your backend expects
      Dislikes: dislikes, // Ensure this is in the format your backend expects
    };

    try {
      const response = await fetch(
        `https://eu-api.backendless.com/45E67874-BB80-82AC-FF2C-42022EE86E00/DD57366F-CE14-42B8-AB3B-1B6854F269E9/data/bookfood_users/${user.objectId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUserData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to update profile:", errorData);
        return;
      }

      const updatedUserDetails = await response.json();
      updateUser({ ...user, ...updatedUserDetails });
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ my: 4, p: 4, borderRadius: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar src={profilePic} sx={{ width: 140, height: 140, mb: 1 }} />
          {isEditMode && (
            <Box sx={{ mb: 2 }}>
              <Button variant="contained" component="label">
                Upload Picture
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleProfilePicChange}
                />
              </Button>
            </Box>
          )}
          <Typography variant="h5" gutterBottom>
            {user?.username}
          </Typography>
          {!isEditMode ? (
            <>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                {bio}
              </Typography>

              <Typography variant="h6" gutterBottom>
                Unwanted Ingredients
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                {unwantedIngredients.map((ingredient, index) => (
                  <Chip key={index} label={ingredient} sx={{ m: 0.5 }} />
                ))}
              </Box>

              <Typography variant="h6" gutterBottom>
                Likes
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                {likes.map((like, index) => (
                  <Chip
                    key={index}
                    label={like}
                    sx={{ m: 0.5 }}
                    color="primary"
                  />
                ))}
              </Box>

              <Typography variant="h6" gutterBottom>
                Dislikes
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                {dislikes.map((dislike, index) => (
                  <Chip
                    key={index}
                    label={dislike}
                    sx={{ m: 0.5 }}
                    color="secondary"
                  />
                ))}
              </Box>
            </>
          ) : (
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ width: "100%", mt: 2 }}
            >
              <TextField
                fullWidth
                label="Bio"
                variant="outlined"
                multiline
                rows={3}
                value={bio}
                onChange={handleBioChange}
                sx={{ mb: 2 }}
              />
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6">Unwanted Ingredients</Typography>
                {ingredientsList.map((ingredient, index) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={unwantedIngredients.includes(ingredient)}
                        onChange={handleUnwantedIngredientChange(ingredient)}
                      />
                    }
                    label={ingredient}
                    key={index}
                  />
                ))}
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6">Likes</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {likes.map((like, index) => (
                    <Chip
                      key={index}
                      label={like}
                      onDelete={() => handleRemoveLike(like)}
                      color="primary"
                      sx={{ m: 0.5 }}
                    />
                  ))}
                  <TextField
                    size="small"
                    value={newLike}
                    onChange={(e) => setNewLike(e.target.value)}
                    placeholder="Add Like"
                    sx={{ flexGrow: 1 }}
                  />
                  <IconButton onClick={handleAddLike} color="primary">
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6">Dislikes</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {dislikes.map((dislike, index) => (
                    <Chip
                      key={index}
                      label={dislike}
                      onDelete={() => handleRemoveDislike(dislike)}
                      color="secondary"
                      sx={{ m: 0.5 }}
                    />
                  ))}
                  <TextField
                    size="small"
                    value={newDislike}
                    onChange={(e) => setNewDislike(e.target.value)}
                    placeholder="Add Dislike"
                    sx={{ flexGrow: 1 }}
                  />
                  <IconButton onClick={handleAddDislike} color="secondary">
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="outlined" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Save Changes
                </Button>
              </Box>
            </Box>
          )}

          {!isEditMode && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsEditMode(true)}
              sx={{ mt: 3 }}
            >
              Edit Profile
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default Profile;
