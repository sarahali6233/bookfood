import React, { useState } from "react";
import { Typography, Container, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Container component="main" maxWidth="lg">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to BookFood
          </Typography>
          <Grid container spacing={3}>
            {/* Widgets here */}
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default Dashboard;
