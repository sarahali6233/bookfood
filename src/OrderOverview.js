// OrderOverview.js

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useUser } from "./UserContext";

const OrderOverview = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersResponse = await fetch(
        "https://eu-api.backendless.com/45E67874-BB80-82AC-FF2C-42022EE86E00/DD57366F-CE14-42B8-AB3B-1B6854F269E9/data/bookfood_orders"
      );
      if (!ordersResponse.ok) {
        console.error("Failed to fetch orders");
        return;
      }
      const ordersData = await ordersResponse.json();

      // Fetch user data for each order
      const ordersWithUserData = await Promise.all(
        ordersData.map(async (order) => {
          const userResponse = await fetch(
            `https://eu-api.backendless.com/45E67874-BB80-82AC-FF2C-42022EE86E00/DD57366F-CE14-42B8-AB3B-1B6854F269E9/data/bookfood_users/${order.ordereruserid}`
          );
          const userData = await userResponse.json();

          return { ...order, username: userData.username }; // Attach username to each order
        })
      );

      setOrders(ordersWithUserData);
    };

    if (user && user.role === "admin") {
      fetchOrders();
    }
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 4 }}>
        Order Overview
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>

              <TableCell align="right">Menu Items</TableCell>
              <TableCell align="right">Order Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {/* {order.username} */}
                  Anonmymous
                </TableCell>
                <TableCell align="right">
                  {JSON.stringify(order.chosenmenuitems)}
                </TableCell>
                <TableCell align="right">{formatDate(order.created)}</TableCell>

                {/* Assuming 'created' is the order date column */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default OrderOverview;
