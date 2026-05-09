import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Chip,
  IconButton,
  Alert,
  Container,
  alpha,
  InputAdornment,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  DateRange as DateRangeIcon,
  People as PeopleIcon,
  ChildCare as ChildCareIcon,
  DirectionsCar as DirectionsCarIcon,
  CheckCircle as CheckCircleIcon,
  EventAvailable as EventAvailableIcon,
  LocalGasStation as LocalGasStationIcon,
  Speed as SpeedIcon,
  Palette as PaletteIcon,
  CreditCard as CreditCardIcon,
  Schedule as ScheduleIcon,
  EmojiPeople as EmojiPeopleIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FF6F61 30%, #FF8E53 90%)',
  border: 0,
  borderRadius: 12,
  color: 'white',
  height: 56,
  padding: '0 40px',
  boxShadow: '0 3px 20px rgba(255, 111, 97, 0.3)',
  fontWeight: 700,
  fontSize: '1.1rem',
  textTransform: 'none',
  '&:hover': {
    background: 'linear-gradient(45deg, #E55450 30%, #FF7B42 90%)',
    boxShadow: '0 6px 25px rgba(255, 111, 97, 0.4)',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
}));

const StyledStepIcon = styled(Box)(({ theme, active }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: active 
    ? 'linear-gradient(45deg, #FF6F61, #FF8E53)' 
    : theme.palette.mode === 'light' ? '#e0e0e0' : '#424242',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: active ? 'white' : '#999',
  fontWeight: 700,
  transition: 'all 0.3s ease',
}));

const steps = ['Select Dates', 'Passenger Details', 'Confirm Booking'];

export default function BookingForm() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [bookingData, setBookingData] = useState({
    checkInDate: new Date().toISOString().split("T")[0],
    checkOutDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    numOfAdults: 1,
    numOfChildren: 0,
    totalNumberOfPassengers: 1,
  });
  const [bookingProcessing, setBookingProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (!storedUser || !token) {
      navigate("/login");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:4040/cars/${carId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCar(response.data.data || response.data);
      } catch (err) {
        console.error("Failed to fetch car details:", err);
        setError("Failed to load car details");
      } finally {
        setLoading(false);
      }
    };

    if (carId) {
      fetchCarDetails();
    }
  }, [carId]);

  // Update total passengers whenever adults or children change
  const handleChange = (field, value) => {
    const updatedData = { ...bookingData, [field]: value };
    updatedData.totalNumberOfPassengers = Number(updatedData.numOfAdults) + Number(updatedData.numOfChildren);
    setBookingData(updatedData);
  };

  const handleNext = () => {
    if (activeStep === 0 && (!bookingData.checkInDate || !bookingData.checkOutDate)) {
      setError("Please select both check-in and check-out dates");
      return;
    }
    if (activeStep === 1 && bookingData.numOfAdults < 1) {
      setError("At least one adult is required");
      return;
    }
    setError(null);
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setError(null);
    setActiveStep((prevStep) => prevStep - 1);
  };

  const calculateDays = () => {
    const checkIn = new Date(bookingData.checkInDate);
    const checkOut = new Date(bookingData.checkOutDate);
    const diffTime = Math.abs(checkOut - checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  };

  const calculateTotalPrice = () => {
    if (!car) return 0;
    const days = calculateDays();
    return days * car.vehiclePrice;
  };

  const handleBookingSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!user || !token) {
      navigate("/login");
      return;
    }

    if (!bookingData.checkInDate || !bookingData.checkOutDate) {
      setError("Please select check-in and check-out dates.");
      return;
    }
    if (bookingData.numOfAdults < 1) {
      setError("At least one adult is required.");
      return;
    }
    if (bookingData.numOfChildren < 0) {
      setError("Number of children cannot be negative.");
      return;
    }

    setBookingProcessing(true);
    try {
      const res = await axios.post(
        `http://localhost:4040/bookings/book-car/${carId}/${user.id}`,
        bookingData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const confirmationCode = res.data?.data?.bookingConfirmationCode || res.data?.bookingConfirmationCode;

      // ✅ Add new notification to localStorage
      let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
      const newNotif = {
        code: confirmationCode,
        date: new Date().toLocaleString(),
        read: false,
      };
      notifications.unshift(newNotif);
      localStorage.setItem("notifications", JSON.stringify(notifications));

      // Show success and redirect
      setTimeout(() => {
        navigate("/customer-home");
      }, 2000);

    } catch (err) {
      console.error(err);
      setError("Booking failed: " + (err.response?.data?.message || err.message));
    } finally {
      setBookingProcessing(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress size={60} sx={{ color: '#FF6F61' }} />
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9ff 0%, #eef2ff 100%)',
      py: 6,
      px: 2,
    }}>
      <Container maxWidth="lg">
        {/* Back Button */}
        <IconButton 
          onClick={() => navigate(-1)}
          sx={{ 
            mb: 4,
            color: '#666',
            '&:hover': { 
              backgroundColor: alpha('#FF6F61', 0.1),
              color: '#FF6F61'
            }
          }}
        >
          <ArrowBackIcon sx={{ mr: 1 }} />
          Back to Cars
        </IconButton>

        <Grid container spacing={4}>
          {/* Left Column - Booking Form */}
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{
              p: 4,
              borderRadius: 4,
              background: 'white',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
              height: '100%',
            }}>
              {/* Stepper */}
              <Box sx={{ mb: 6 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label, index) => (
                    <Step key={label}>
                      <StepLabel 
                        StepIconComponent={() => (
                          <StyledStepIcon active={index <= activeStep}>
                            {index + 1}
                          </StyledStepIcon>
                        )}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 600, color: index <= activeStep ? '#333' : '#999' }}>
                          {label}
                        </Typography>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              {/* Step 1: Select Dates */}
              {activeStep === 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#333' }}>
                    <DateRangeIcon sx={{ mr: 1, color: '#FF6F61' }} />
                    Select Dates
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Check-in Date"
                        type="date"
                        value={bookingData.checkInDate}
                        onChange={(e) => handleChange("checkInDate", e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EventAvailableIcon sx={{ color: '#FF6F61' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Check-out Date"
                        type="date"
                        value={bookingData.checkOutDate}
                        onChange={(e) => handleChange("checkOutDate", e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EventAvailableIcon sx={{ color: '#FF6F61' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 4, p: 3, bgcolor: alpha('#FF6F61', 0.05), borderRadius: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#FF6F61', mb: 1 }}>
                      Booking Duration
                    </Typography>
                    <Typography variant="h6">
                      {calculateDays()} {calculateDays() === 1 ? 'Day' : 'Days'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      {bookingData.checkInDate} → {bookingData.checkOutDate}
                    </Typography>
                  </Box>
                </motion.div>
              )}

              {/* Step 2: Passenger Details */}
              {activeStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#333' }}>
                    <PeopleIcon sx={{ mr: 1, color: '#FF6F61' }} />
                    Passenger Details
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Number of Adults"
                        type="number"
                        value={bookingData.numOfAdults}
                        onChange={(e) => handleChange("numOfAdults", Number(e.target.value))}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmojiPeopleIcon sx={{ color: '#FF6F61' }} />
                            </InputAdornment>
                          ),
                          inputProps: { min: 1 }
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Number of Children"
                        type="number"
                        value={bookingData.numOfChildren}
                        onChange={(e) => handleChange("numOfChildren", Number(e.target.value))}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <ChildCareIcon sx={{ color: '#FF6F61' }} />
                            </InputAdornment>
                          ),
                          inputProps: { min: 0 }
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 4, p: 3, bgcolor: alpha('#4CAF50', 0.08), borderRadius: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#4CAF50', mb: 1 }}>
                      Total Passengers
                    </Typography>
                    <Typography variant="h3" sx={{ color: '#4CAF50', fontWeight: 800 }}>
                      {bookingData.totalNumberOfPassengers}
                      <Typography variant="caption" sx={{ display: 'block', color: '#666', fontWeight: 400 }}>
                        {bookingData.numOfAdults} Adults • {bookingData.numOfChildren} Children
                      </Typography>
                    </Typography>
                  </Box>
                </motion.div>
              )}

              {/* Step 3: Confirm Booking */}
              {activeStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#333' }}>
                    <CheckCircleIcon sx={{ mr: 1, color: '#FF6F61' }} />
                    Confirm Booking
                  </Typography>
                  
                  <Box sx={{ mt: 3, p: 3, bgcolor: alpha('#2196F3', 0.08), borderRadius: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2196F3', mb: 2 }}>
                      Booking Summary
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Duration</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{calculateDays()} Days</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Passengers</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{bookingData.totalNumberOfPassengers}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Daily Rate</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>${car?.vehiclePrice}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Total</Typography>
                        <Typography variant="h6" sx={{ color: '#FF6F61', fontWeight: 800 }}>${calculateTotalPrice()}</Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  <Box sx={{ mt: 4, p: 3, bgcolor: alpha('#FF6F61', 0.05), borderRadius: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#FF6F61', mb: 1, display: 'flex', alignItems: 'center' }}>
                      <CreditCardIcon sx={{ mr: 1 }} />
                      Payment Information
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                      Payment will be processed after booking confirmation. You'll receive an email with payment instructions.
                    </Typography>
                    <Chip label="Pay on Pickup" color="primary" variant="outlined" sx={{ borderRadius: 2 }} />
                  </Box>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Alert severity="error" sx={{ mt: 3, borderRadius: 3 }}>
                    {error}
                  </Alert>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    color: '#666',
                    borderColor: '#ddd',
                    '&:hover': {
                      borderColor: '#FF6F61',
                      color: '#FF6F61',
                    }
                  }}
                >
                  Back
                </Button>

                {activeStep === steps.length - 1 ? (
                  <GradientButton
                    onClick={handleBookingSubmit}
                    disabled={bookingProcessing}
                    startIcon={bookingProcessing ? null : <CheckCircleIcon />}
                  >
                    {bookingProcessing ? (
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                      'Confirm Booking'
                    )}
                  </GradientButton>
                ) : (
                  <GradientButton onClick={handleNext}>
                    Continue
                  </GradientButton>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Right Column - Car Details */}
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{
              p: 4,
              borderRadius: 4,
              background: 'white',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
              height: '100%',
              position: 'sticky',
              top: 20,
            }}>
              {car && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Car Image */}
                  <Box sx={{
                    position: 'relative',
                    borderRadius: 3,
                    overflow: 'hidden',
                    mb: 4,
                    height: 240,
                  }}>
                    <img 
                      src={car.vehiclePhotoURL} 
                      alt={car.vehicleDescription}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <Chip
                      label="Available Now"
                      color="success"
                      icon={<CheckCircleIcon />}
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        fontWeight: 600,
                        borderRadius: 2,
                      }}
                    />
                  </Box>

                  {/* Car Details */}
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#333' }}>
                    {car.vehicleDescription}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    <Chip
                      icon={<DirectionsCarIcon />}
                      label={car.vehicleCategory}
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                    <Chip
                      icon={<LocalGasStationIcon />}
                      label={car.fuelType}
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                    <Chip
                      icon={<SpeedIcon />}
                      label="Auto Transmission"
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Pricing */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>Daily Rate</Typography>
                    <Typography variant="h2" sx={{ 
                      fontWeight: 900,
                      background: 'linear-gradient(45deg, #FF6F61, #FF8E53)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1
                    }}>
                      ${car.vehiclePrice}
                      <Typography variant="caption" sx={{ display: 'block', color: '#888', fontWeight: 400 }}>
                        per day
                      </Typography>
                    </Typography>
                  </Box>

                  {/* Features */}
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                      <ScheduleIcon sx={{ mr: 1, color: '#FF6F61' }} />
                      Included Features
                    </Typography>
                    <Grid container spacing={2}>
                      {['Air Conditioning', 'Bluetooth', 'GPS Navigation', 'Airbags', 'Backup Camera', 'Keyless Entry'].map((feature, index) => (
                        <Grid item xs={6} key={index}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CheckCircleIcon sx={{ fontSize: 16, color: '#4CAF50', mr: 1 }} />
                            <Typography variant="body2" sx={{ color: '#666' }}>{feature}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  {/* User Info */}
                  <Divider sx={{ my: 4 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: alpha('#FF6F61', 0.05), borderRadius: 3 }}>
                    <Avatar sx={{ bgcolor: '#FF6F61', mr: 2 }}>
                      {user?.username?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{user?.username}</Typography>
                      <Typography variant="caption" sx={{ color: '#666' }}>{user?.email}</Typography>
                    </Box>
                  </Box>
                </motion.div>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}