import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Container } from "@mui/material";
import TopAppBar from "./TopAppBar";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import Dashboard from "./Dashboard";
import ForgotPasswordForm from "./ForgotPasswordForm";
import Profile from "./Profile";
import Menu from "./Menu";
import Settings from "./Settings";
import OrderOverview from "./OrderOverview";
import EditMenu from "./EditMenu"; // Import the EditMenu component
import { UserProvider } from "./UserContext";

function Layout() {
  const location = useLocation();
  const hideAppBarPaths = ["/login", "/signup", "/forgotpassword"];

  return (
    <>
      {!hideAppBarPaths.includes(location.pathname) && <TopAppBar />}
      <Container component="main" maxWidth="xl">
        <Routes>
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forgotpassword" element={<ForgotPasswordForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<OrderOverview />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/edit-menu" element={<EditMenu />} />{" "}
          {/* Add EditMenu route */}
          {/* Additional routes */}
        </Routes>
      </Container>
    </>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <Layout />
      </Router>
    </UserProvider>
  );
}

export default App;
