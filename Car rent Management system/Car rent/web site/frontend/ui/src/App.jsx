import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

import Home from './page/Home'; 
import SignUp from './page/Signup'; 
import LOGIN from './page/Login'; 
import AdminHome from './page/AdminDashboard';
import Vehicles from './page/Vehicles';
import UserManagement from './page/UserManagement';

import CustomerHome from './page/CustomerHome';
import BookingForm from './Customer/BookingForm';
import AvailableCarsForm from './Customer/AvailableCarsForm';
import UserBookings from "./Customer/UserBookings";
import AllBookingsAdmin from './Admin/AllBookingsAdmin';

import Settings from './Settings';

export default function App() {
  // Track theme dynamically
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  // Keep theme in sync with localStorage
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // MUI theme
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#FF6F61" },
      secondary: { main: "#555" },
      background: {
        default: darkMode ? "#121212" : "#f5f7fa",
        paper: darkMode ? "#1e1e1e" : "#fff",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Ensures MUI components follow the theme */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LOGIN />} />
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/vehicle" element={<Vehicles />} />
          <Route path="/userManagement" element={<UserManagement />} />
          <Route path="/customer-home" element={<CustomerHome />} />
          <Route path="/bookings/book-car/:carId/:userId" element={<BookingForm />} />
          <Route path="/availableCarsForm" element={<AvailableCarsForm />} />
          <Route path="/my-bookings" element={<UserBookings />} />
          <Route path="/allBookingsAdmin" element={<AllBookingsAdmin />} />
          
          {/* Pass darkMode state and setter to Settings page */}
          <Route path="/settings" element={<Settings darkMode={darkMode} setDarkMode={setDarkMode} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
