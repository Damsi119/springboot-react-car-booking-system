import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  alpha,
  Fade,
  Zoom,
  Container,
  Tabs,
  Tab,
  Stack,
  Tooltip,
  Rating,
  LinearProgress,
  Badge,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Search as SearchIcon,
  DateRange as DateRangeIcon,
  LocalGasStation as LocalGasStationIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
  ChildCare as ChildCareIcon,
  DirectionsCar as DirectionsCarIcon,
  AttachMoney as AttachMoneyIcon,
  EventAvailable as EventAvailableIcon,
  Speed as SpeedIcon,
  Palette as PaletteIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Whatshot as WhatshotIcon,
  Bolt as BoltIcon,
  AirlineSeatReclineNormal as SeatIcon,
  FilterAlt as FilterAltIcon,
  Sort as SortIcon,
  TrendingUp as TrendingUpIcon,
  ElectricCar as ElectricCarIcon,
  AcUnit as AcUnitIcon,
  SettingsSuggest as SettingsSuggestIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { styled, keyframes } from "@mui/material/styles";

// ================= ANIMATIONS =================
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const shimmerAnimation = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

// ================= STYLED COMPONENTS =================
const GradientCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.85)} 100%)`,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  borderRadius: 24,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: 'linear-gradient(90deg, #FF6F61, #FF8E53, #FFB74D)',
    backgroundSize: '200% 100%',
    animation: `${shimmerAnimation} 3s infinite linear`,
  },
  '&:hover': {
    transform: 'translateY(-12px)',
    boxShadow: `0 30px 60px -12px ${alpha(theme.palette.primary.main, 0.3)}`,
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FF6F61 0%, #FF8E53 50%, #FFB74D 100%)',
  backgroundSize: '200% 100%',
  border: 0,
  borderRadius: 14,
  color: 'white',
  height: 56,
  padding: '0 36px',
  boxShadow: '0 6px 25px rgba(255, 111, 97, 0.4)',
  fontWeight: 800,
  textTransform: 'none',
  fontSize: '1.1rem',
  letterSpacing: '0.5px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.4s ease',
  '&:hover': {
    backgroundPosition: '100% 0',
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 35px rgba(255, 111, 97, 0.6)',
    animation: `${pulseAnimation} 1s ease-in-out`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: -100,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
    transition: '0.8s',
  },
  '&:hover::after': {
    left: '100%',
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    background: 'linear-gradient(90deg, #FF6F61, #FF8E53)',
    height: 4,
    borderRadius: 2,
  },
  '& .MuiTab-root': {
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'none',
    color: theme.palette.text.secondary,
    '&.Mui-selected': {
      color: '#FF6F61',
    },
  },
}));

const FeatureChip = styled(Chip)(({ theme }) => ({
  background: alpha('#FF6F61', 0.08),
  color: '#FF6F61',
  fontWeight: 600,
  borderRadius: 12,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: alpha('#FF6F61', 0.15),
    transform: 'scale(1.05)',
  },
}));

// ================= MAIN COMPONENT =================
export default function AvailableCarsForm() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    checkInDate: new Date().toISOString().split("T")[0],
    checkOutDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    vehicleCategory: "",
    fuelType: "All",
    numOfAdults: 1,
    numOfChildren: 0,
  });
  const [categories, setCategories] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [sortBy, setSortBy] = useState("recommended");
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Redirect to login if not logged in
  useEffect(() => {
    if (!token || !user) {
      setSnackbar({ open: true, message: "You must be logged in to access this page.", severity: "error" });
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  }, [token, user]);

  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:4040/cars/categories", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setCategories(res.data))
      .catch(() => setSnackbar({ open: true, message: "Failed to fetch categories", severity: "error" }));
  }, [token]);

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!token) return;

    const { checkInDate, checkOutDate, vehicleCategory, fuelType } = formData;

    if (!checkInDate || !checkOutDate || !vehicleCategory) {
      setSnackbar({ open: true, message: "Please fill in all required fields.", severity: "error" });
      return;
    }
    if (new Date(checkOutDate) < new Date(checkInDate)) {
      setSnackbar({ open: true, message: "Check-out date must be after check-in date.", severity: "error" });
      return;
    }

    setLoading(true);
    setSearching(true);
    try {
      const params = { checkInDate, checkOutDate, vehicleCategory };
      if (fuelType !== "All") params.fuelType = fuelType;

      const res = await axios.get(
        "http://localhost:4040/cars/available-cars-by-date-and-vehicleCategory",
        { params, headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.carList?.length) {
        // Enhance car data with additional features for demo
        const enhancedCars = res.data.carList.map(car => ({
          ...car,
          rating: (Math.random() * 2 + 3.5).toFixed(1),
          reviews: Math.floor(Math.random() * 100) + 10,
          features: ['AC', 'Bluetooth', 'GPS', 'Airbags', 'Backup Camera'].slice(0, 3 + Math.floor(Math.random() * 2)),
          instantBook: Math.random() > 0.3,
          discount: Math.random() > 0.7 ? Math.floor(Math.random() * 20) + 5 : 0,
        }));
        setResults(enhancedCars);
      } else {
        setResults([]);
        setSnackbar({ open: true, message: "No available cars found for your criteria.", severity: "info" });
      }
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: err.response?.data?.message || "Error fetching cars", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = async (carId) => {
    if (!token || !user) {
      setSnackbar({ open: true, message: "You must be logged in to book a car.", severity: "error" });
      return;
    }

    const bookingData = {
      checkInDate: formData.checkInDate,
      checkOutDate: formData.checkOutDate,
      numOfAdults: formData.numOfAdults,
      numOfChildren: formData.numOfChildren,
      totalNumberOfPassengers: formData.numOfAdults + formData.numOfChildren,
    };

    try {
      const res = await axios.post(
        `http://localhost:4040/bookings/book-car/${carId}/${user.id}`,
        bookingData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const confirmationCode = res.data?.data?.bookingConfirmationCode || res.data?.bookingConfirmationCode;

      if (confirmationCode) {
        let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
        notifications.unshift({ 
          code: confirmationCode, 
          date: new Date().toLocaleString(),
          type: 'booking',
          read: false 
        });
        localStorage.setItem("notifications", JSON.stringify(notifications));

        setSnackbar({ 
          open: true, 
          message: `🎉 Successfully booked! Confirmation Code: ${confirmationCode}`,
          severity: "success" 
        });
      } else {
        setSnackbar({ open: true, message: res.data?.message || "Booking failed", severity: "error" });
      }
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: err.response?.data?.message || "Booking error", severity: "error" });
    }
  };

  const totalPassengers = formData.numOfAdults + formData.numOfChildren;
  const daysBetween = Math.ceil(
    (new Date(formData.checkOutDate) - new Date(formData.checkInDate)) / (1000 * 60 * 60 * 24)
  ) || 1;

  const carFeatures = [
    { icon: <AcUnitIcon />, label: 'AC', value: 'ac' },
    { icon: <BoltIcon />, label: 'Fast Charging', value: 'fast_charging' },
    { icon: <WhatshotIcon />, label: 'Premium', value: 'premium' },
    { icon: <SeatIcon />, label: '7 Seater', value: 'seven_seater' },
    { icon: <SettingsSuggestIcon />, label: 'Auto', value: 'automatic' },
  ];

  const sortOptions = [
    { value: 'recommended', label: 'Recommended', icon: <StarIcon /> },
    { value: 'price_low', label: 'Price: Low to High', icon: <AttachMoneyIcon /> },
    { value: 'price_high', label: 'Price: High to Low', icon: <AttachMoneyIcon /> },
    { value: 'rating', label: 'Highest Rated', icon: <TrendingUpIcon /> },
  ];

  const handleFeatureToggle = (feature) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.vehiclePrice - b.vehiclePrice;
      case 'price_high':
        return b.vehiclePrice - a.vehiclePrice;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      position: 'relative',
      overflow: 'hidden',
      py: { xs: 2, md: 4 },
      px: { xs: 1, md: 2 },
    }}>
      {/* Animated Background Elements */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <Container maxWidth={false} sx={{ 
        position: 'relative', 
        zIndex: 1,
        height: '100%',
        maxWidth: '100% !important',
        px: { xs: 1, sm: 2, md: 4, lg: 6 },
      }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ 
            textAlign: 'center', 
            mb: { xs: 3, md: 6 },
            px: { xs: 1, md: 4 },
          }}>
            <Typography variant="h2" sx={{
              fontWeight: 900,
              background: 'linear-gradient(45deg, #ffffff, #FFD700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
              lineHeight: 1.2,
            }}>
              Discover Your Dream Car
            </Typography>
            <Typography variant="h5" sx={{
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 400,
              maxWidth: 800,
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.25rem' },
            }}>
              Find the perfect vehicle for your journey with our advanced search
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={{ xs: 2, md: 4 }} sx={{ height: '100%' }}>
          {/* Left Column - Form */}
          <Grid item xs={12} lg={5} xl={4}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ height: '100%' }}
            >
              <GradientCard sx={{ height: '100%' }}>
                <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{
                      fontWeight: 800,
                      color: '#333',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 1,
                    }}>
                      <Box sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 14,
                        background: 'linear-gradient(45deg, #FF6F61, #FF8E53)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: `${floatAnimation} 3s ease-in-out infinite`,
                      }}>
                        <SearchIcon sx={{ color: 'white', fontSize: 24 }} />
                      </Box>
                      Search Filters
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', ml: 7 }}>
                      Customize your search criteria
                    </Typography>
                  </Box>

                  <StyledTabs 
                    value={activeTab} 
                    onChange={(e, val) => setActiveTab(val)}
                    variant="fullWidth"
                    sx={{ mb: 4 }}
                  >
                    <Tab label="Dates & Category" />
                    <Tab label="Preferences" />
                    <Tab label="Features" />
                  </StyledTabs>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {activeTab === 0 && (
                        <Stack spacing={4}>
                          {/* Dates */}
                          <Box>
                            <Typography variant="h6" sx={{ 
                              fontWeight: 700, 
                              mb: 2, 
                              color: '#333',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}>
                              <DateRangeIcon sx={{ color: '#FF6F61' }} />
                              Travel Dates
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  type="date"
                                  label="Check-in"
                                  value={formData.checkInDate}
                                  onChange={e => handleChange("checkInDate", e.target.value)}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <EventAvailableIcon sx={{ color: '#FF6F61' }} />
                                      </InputAdornment>
                                    ),
                                  }}
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 12,
                                      background: 'rgba(255,255,255,0.9)',
                                    }
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  type="date"
                                  label="Check-out"
                                  value={formData.checkOutDate}
                                  onChange={e => handleChange("checkOutDate", e.target.value)}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <EventAvailableIcon sx={{ color: '#FF6F61' }} />
                                      </InputAdornment>
                                    ),
                                  }}
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 12,
                                      background: 'rgba(255,255,255,0.9)',
                                    }
                                  }}
                                />
                              </Grid>
                            </Grid>
                            <Box sx={{ 
                              mt: 2, 
                              p: 2, 
                              borderRadius: 2,
                              background: 'linear-gradient(135deg, rgba(255,111,97,0.1), rgba(255,142,83,0.1))',
                              border: '1px solid rgba(255,111,97,0.2)',
                            }}>
                              <Typography variant="body2" sx={{ color: '#FF6F61', fontWeight: 600 }}>
                                {daysBetween} {daysBetween === 1 ? 'Day' : 'Days'} • {totalPassengers} Passenger{totalPassengers !== 1 ? 's' : ''}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Category */}
                          <Box>
                            <Typography variant="h6" sx={{ 
                              fontWeight: 700, 
                              mb: 2, 
                              color: '#333',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}>
                              <CategoryIcon sx={{ color: '#FF6F61' }} />
                              Vehicle Type
                            </Typography>
                            <TextField
                              select
                              fullWidth
                              label="Select Category"
                              value={formData.vehicleCategory}
                              onChange={e => handleChange("vehicleCategory", e.target.value)}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 12,
                                  background: 'rgba(255,255,255,0.9)',
                                }
                              }}
                            >
                              {categories.length > 0 ? 
                                categories.map((cat, i) => (
                                  <MenuItem key={i} value={cat} sx={{ py: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                      <DirectionsCarIcon sx={{ color: '#FF6F61' }} />
                                      <Box>
                                        <Typography sx={{ fontWeight: 600 }}>{cat}</Typography>
                                        <Typography variant="caption" sx={{ color: '#666' }}>
                                          {i === 0 ? 'Economy & Comfort' : 
                                           i === 1 ? 'Luxury & Premium' : 
                                           'Family & SUVs'}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </MenuItem>
                                )) : 
                                <MenuItem disabled>
                                  <CircularProgress size={20} sx={{ mr: 2 }} />
                                  Loading categories...
                                </MenuItem>
                              }
                            </TextField>
                          </Box>
                        </Stack>
                      )}

                      {activeTab === 1 && (
                        <Stack spacing={4}>
                          {/* Fuel Type */}
                          <Box>
                            <Typography variant="h6" sx={{ 
                              fontWeight: 700, 
                              mb: 2, 
                              color: '#333',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}>
                              <LocalGasStationIcon sx={{ color: '#FF6F61' }} />
                              Fuel Type
                            </Typography>
                            <Grid container spacing={2}>
                              {["All", "Petrol", "Diesel", "Electric", "Hybrid"].map((fuel) => (
                                <Grid item xs={6} sm={4} key={fuel}>
                                  <Button
                                    fullWidth
                                    variant={formData.fuelType === fuel ? "contained" : "outlined"}
                                    onClick={() => handleChange("fuelType", fuel)}
                                    sx={{
                                      borderRadius: 12,
                                      py: 1.5,
                                      background: formData.fuelType === fuel 
                                        ? 'linear-gradient(45deg, #FF6F61, #FF8E53)' 
                                        : 'transparent',
                                      borderColor: formData.fuelType === fuel ? 'transparent' : '#ddd',
                                      fontWeight: 600,
                                    }}
                                  >
                                    {fuel}
                                  </Button>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>

                          {/* Passengers */}
                          <Box>
                            <Typography variant="h6" sx={{ 
                              fontWeight: 700, 
                              mb: 2, 
                              color: '#333',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}>
                              <PeopleIcon sx={{ color: '#FF6F61' }} />
                              Passengers
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <TextField
                                  fullWidth
                                  type="number"
                                  label="Adults"
                                  value={formData.numOfAdults}
                                  onChange={e => handleChange("numOfAdults", parseInt(e.target.value))}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <PeopleIcon sx={{ color: '#FF6F61' }} />
                                      </InputAdornment>
                                    ),
                                    inputProps: { min: 1, max: 10 }
                                  }}
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 12,
                                      background: 'rgba(255,255,255,0.9)',
                                    }
                                  }}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  fullWidth
                                  type="number"
                                  label="Children"
                                  value={formData.numOfChildren}
                                  onChange={e => handleChange("numOfChildren", parseInt(e.target.value))}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <ChildCareIcon sx={{ color: '#FF6F61' }} />
                                      </InputAdornment>
                                    ),
                                    inputProps: { min: 0, max: 10 }
                                  }}
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 12,
                                      background: 'rgba(255,255,255,0.9)',
                                    }
                                  }}
                                />
                              </Grid>
                            </Grid>
                            <Box sx={{ 
                              mt: 2, 
                              textAlign: 'center',
                              p: 2,
                              borderRadius: 12,
                              background: 'linear-gradient(135deg, rgba(76,175,80,0.1), rgba(139,195,74,0.1))',
                            }}>
                              <Typography variant="h5" sx={{ color: '#4CAF50', fontWeight: 800 }}>
                                {totalPassengers}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#666' }}>
                                Total Passengers
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>
                      )}

                      {activeTab === 2 && (
                        <Stack spacing={4}>
                          {/* Car Features */}
                          <Box>
                            <Typography variant="h6" sx={{ 
                              fontWeight: 700, 
                              mb: 2, 
                              color: '#333',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}>
                              <SettingsSuggestIcon sx={{ color: '#FF6F61' }} />
                              Additional Features
                            </Typography>
                            <Grid container spacing={2}>
                              {carFeatures.map((feature) => (
                                <Grid item xs={6} sm={4} key={feature.value}>
                                  <Tooltip title={feature.label}>
                                    <IconButton
                                      onClick={() => handleFeatureToggle(feature.value)}
                                      sx={{
                                        width: '100%',
                                        height: 80,
                                        borderRadius: 16,
                                        background: selectedFeatures.includes(feature.value)
                                          ? 'linear-gradient(135deg, #FF6F61, #FF8E53)'
                                          : 'rgba(255,255,255,0.9)',
                                        border: '2px solid',
                                        borderColor: selectedFeatures.includes(feature.value)
                                          ? 'transparent'
                                          : '#eee',
                                        '&:hover': {
                                          background: selectedFeatures.includes(feature.value)
                                            ? 'linear-gradient(135deg, #E55450, #FF7B42)'
                                            : 'rgba(255,255,255,1)',
                                        },
                                      }}
                                    >
                                      <Box sx={{ 
                                        color: selectedFeatures.includes(feature.value) ? 'white' : '#FF6F61',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 1,
                                      }}>
                                        {feature.icon}
                                        <Typography variant="caption" sx={{ 
                                          fontWeight: 600,
                                          fontSize: '0.75rem',
                                        }}>
                                          {feature.label}
                                        </Typography>
                                      </Box>
                                    </IconButton>
                                  </Tooltip>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>

                          {/* Sort By */}
                          <Box>
                            <Typography variant="h6" sx={{ 
                              fontWeight: 700, 
                              mb: 2, 
                              color: '#333',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}>
                              <SortIcon sx={{ color: '#FF6F61' }} />
                              Sort Results By
                            </Typography>
                            <Grid container spacing={2}>
                              {sortOptions.map((option) => (
                                <Grid item xs={6} key={option.value}>
                                  <Button
                                    fullWidth
                                    variant={sortBy === option.value ? "contained" : "outlined"}
                                    startIcon={option.icon}
                                    onClick={() => setSortBy(option.value)}
                                    sx={{
                                      borderRadius: 12,
                                      py: 1.5,
                                      justifyContent: 'flex-start',
                                      background: sortBy === option.value 
                                        ? 'linear-gradient(45deg, #FF6F61, #FF8E53)' 
                                        : 'transparent',
                                      borderColor: sortBy === option.value ? 'transparent' : '#ddd',
                                      fontWeight: 600,
                                    }}
                                  >
                                    {option.label}
                                  </Button>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        </Stack>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <Box sx={{ mt: 6 }}>
                    <GradientButton
                      fullWidth
                      onClick={handleSubmit}
                      disabled={loading}
                      startIcon={loading ? null : <SearchIcon />}
                      size="large"
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ color: 'white' }} />
                      ) : (
                        <>
                          Search Cars
                          <ArrowForwardIcon sx={{ ml: 1 }} />
                        </>
                      )}
                    </GradientButton>
                  </Box>
                </CardContent>
              </GradientCard>
            </motion.div>
          </Grid>

          {/* Right Column - Results */}
          <Grid item xs={12} lg={7} xl={8}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ height: '100%' }}
            >
              <GradientCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ 
                  p: { xs: 2, md: 4 }, 
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 4,
                    flexWrap: 'wrap',
                    gap: 2,
                  }}>
                    <Box>
                      <Typography variant="h4" sx={{ 
                        fontWeight: 800, 
                        color: '#333',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mb: 1,
                      }}>
                        <Box sx={{
                          width: 50,
                          height: 50,
                          borderRadius: 14,
                          background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          animation: `${floatAnimation} 3s ease-in-out infinite`,
                          animationDelay: '0.5s',
                        }}>
                          <DirectionsCarIcon sx={{ color: 'white', fontSize: 24 }} />
                        </Box>
                        Available Cars
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#666', ml: 7 }}>
                        {searching 
                          ? `${sortedResults.length} ${sortedResults.length === 1 ? 'car' : 'cars'} found for your search`
                          : 'Fill in the search form to find available cars'
                        }
                      </Typography>
                    </Box>
                    
                    {sortedResults.length > 0 && (
                      <Badge
                        badgeContent={sortedResults.length}
                        color="primary"
                        sx={{
                          '& .MuiBadge-badge': {
                            fontSize: '1.2rem',
                            height: 40,
                            minWidth: 40,
                            borderRadius: 20,
                            animation: `${pulseAnimation} 2s infinite`,
                          },
                        }}
                      >
                        <Chip
                          label="Available Now"
                          color="success"
                          icon={<CheckCircleIcon />}
                          sx={{ 
                            fontWeight: 800, 
                            fontSize: '1rem',
                            borderRadius: 16,
                            py: 2,
                            px: 3,
                          }}
                        />
                      </Badge>
                    )}
                  </Box>

                  <Divider sx={{ mb: 4 }} />

                  {/* Loading State */}
                  {loading && (
                    <Box sx={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      py: 8,
                    }}>
                      <CircularProgress 
                        size={80} 
                        thickness={4}
                        sx={{ 
                          color: '#FF6F61', 
                          mb: 4,
                          animation: `${floatAnimation} 2s ease-in-out infinite`,
                        }} 
                      />
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#333', mb: 2 }}>
                        Finding Your Perfect Ride
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#666', mb: 3, textAlign: 'center' }}>
                        Searching through our premium collection...
                      </Typography>
                      <LinearProgress 
                        sx={{ 
                          width: '60%', 
                          height: 8, 
                          borderRadius: 4,
                          background: 'linear-gradient(90deg, #FF6F61, #FF8E53)',
                        }} 
                      />
                    </Box>
                  )}

                  {/* Empty State */}
                  {!loading && sortedResults.length === 0 && (
                    <Box sx={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      textAlign: 'center',
                      py: 8,
                      px: 4,
                    }}>
                      <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <DirectionsCarIcon sx={{ 
                          fontSize: 120, 
                          color: '#e0e0e0', 
                          mb: 4,
                        }} />
                      </motion.div>
                      <Typography variant="h4" sx={{ 
                        fontWeight: 800, 
                        color: '#999', 
                        mb: 2,
                      }}>
                        {searching ? 'No Cars Found' : 'Ready to Explore?'}
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        color: '#aaa', 
                        maxWidth: 500, 
                        mb: 4,
                        fontSize: '1.1rem',
                      }}>
                        {searching 
                          ? 'Try adjusting your search filters or selecting different dates to find available cars.'
                          : 'Fill in the search form on the left to find the perfect car for your journey.'
                        }
                      </Typography>
                      {searching && (
                        <GradientButton
                          onClick={() => {
                            setFormData({
                              ...formData,
                              vehicleCategory: "",
                              fuelType: "All",
                            });
                            setSelectedFeatures([]);
                          }}
                          startIcon={<FilterAltIcon />}
                        >
                          Reset Filters
                        </GradientButton>
                      )}
                    </Box>
                  )}

                  {/* Results Grid */}
                  {!loading && sortedResults.length > 0 && (
                    <Box sx={{ 
                      flex: 1,
                      overflow: 'auto',
                      pr: 1,
                      '&::-webkit-scrollbar': {
                        width: 8,
                      },
                      '&::-webkit-scrollbar-track': {
                        background: 'rgba(0,0,0,0.05)',
                        borderRadius: 4,
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: 'linear-gradient(45deg, #FF6F61, #FF8E53)',
                        borderRadius: 4,
                      },
                    }}>
                      <Grid container spacing={3}>
                        {sortedResults.map((car, index) => (
                          <Grid item xs={12} key={car.id}>
                            <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                              <GradientCard>
                                <CardContent sx={{ p: 3 }}>
                                  <Grid container spacing={3} alignItems="center">
                                    {/* Car Image */}
                                    <Grid item xs={12} md={4}>
                                      <Box sx={{
                                        position: 'relative',
                                        borderRadius: 20,
                                        overflow: 'hidden',
                                        height: 200,
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
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
                                        <Box sx={{
                                          position: 'absolute',
                                          top: 0,
                                          left: 0,
                                          right: 0,
                                          bottom: 0,
                                          background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.8))',
                                        }} />
                                        
                                        {/* Discount Badge */}
                                        {car.discount > 0 && (
                                          <Chip
                                            label={`${car.discount}% OFF`}
                                            sx={{
                                              position: 'absolute',
                                              top: 16,
                                              left: 16,
                                              bgcolor: '#FF4081',
                                              color: 'white',
                                              fontWeight: 800,
                                              fontSize: '0.875rem',
                                              borderRadius: 12,
                                              boxShadow: '0 4px 12px rgba(255,64,129,0.4)',
                                            }}
                                          />
                                        )}

                                        {/* Instant Book Badge */}
                                        {car.instantBook && (
                                          <Chip
                                            icon={<BoltIcon />}
                                            label="Instant Book"
                                            size="small"
                                            sx={{
                                              position: 'absolute',
                                              bottom: 16,
                                              left: 16,
                                              bgcolor: '#4CAF50',
                                              color: 'white',
                                              fontWeight: 700,
                                              borderRadius: 12,
                                            }}
                                          />
                                        )}

                                        {/* Rating */}
                                        <Box sx={{
                                          position: 'absolute',
                                          bottom: 16,
                                          right: 16,
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 0.5,
                                          background: 'rgba(0,0,0,0.7)',
                                          padding: '4px 12px',
                                          borderRadius: 20,
                                        }}>
                                          <StarIcon sx={{ color: '#FFD700', fontSize: 16 }} />
                                          <Typography sx={{ color: 'white', fontWeight: 700 }}>
                                            {car.rating}
                                          </Typography>
                                          <Typography variant="caption" sx={{ color: '#ccc', ml: 0.5 }}>
                                            ({car.reviews})
                                          </Typography>
                                        </Box>
                                      </Box>
                                    </Grid>
                                    
                                    {/* Car Details */}
                                    <Grid item xs={12} md={5}>
                                      <Box>
                                        <Typography variant="h5" sx={{ 
                                          fontWeight: 900, 
                                          mb: 1,
                                          background: 'linear-gradient(45deg, #FF6F61, #FF8E53)',
                                          WebkitBackgroundClip: 'text',
                                          WebkitTextFillColor: 'transparent',
                                        }}>
                                          {car.vehicleDescription}
                                        </Typography>
                                        
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                                          <FeatureChip
                                            icon={<CategoryIcon />}
                                            label={car.vehicleCategory}
                                          />
                                          <FeatureChip
                                            icon={<LocalGasStationIcon />}
                                            label={car.fuelType}
                                          />
                                          <FeatureChip
                                            icon={<SpeedIcon />}
                                            label={`${car.mileage || 'N/A'} kmpl`}
                                          />
                                        </Box>

                                        <Typography variant="body1" sx={{ 
                                          color: '#666', 
                                          lineHeight: 1.6,
                                          mb: 3,
                                          display: 'flex',
                                          alignItems: 'flex-start',
                                          gap: 1,
                                        }}>
                                          <WhatshotIcon sx={{ color: '#FF6F61', mt: 0.5, flexShrink: 0 }} />
                                          Features: {car.features.join(' • ')}
                                        </Typography>

                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                          {car.features.map((feature, idx) => (
                                            <Chip
                                              key={idx}
                                              label={feature}
                                              size="small"
                                              variant="outlined"
                                              sx={{ 
                                                borderRadius: 8,
                                                borderColor: '#FF6F61',
                                                color: '#FF6F61',
                                              }}
                                            />
                                          ))}
                                        </Box>
                                      </Box>
                                    </Grid>
                                    
                                    {/* Price & Booking */}
                                    <Grid item xs={12} md={3}>
                                      <Box sx={{ textAlign: 'center' }}>
                                        <Box sx={{ mb: 3 }}>
                                          {car.discount > 0 && (
                                            <Typography variant="body2" sx={{ 
                                              color: '#999',
                                              textDecoration: 'line-through',
                                              mb: 0.5,
                                            }}>
                                              ${(car.vehiclePrice * 1.2).toFixed(0)}/day
                                            </Typography>
                                          )}
                                          <Typography variant="h3" sx={{ 
                                            fontWeight: 900,
                                            background: 'linear-gradient(45deg, #FF6F61, #FF8E53)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            mb: 0.5,
                                          }}>
                                            ${car.vehiclePrice}
                                            <Typography variant="caption" sx={{ 
                                              display: 'block', 
                                              color: '#888', 
                                              fontWeight: 500,
                                            }}>
                                              per day
                                            </Typography>
                                          </Typography>
                                          <Typography variant="caption" sx={{ 
                                            color: '#4CAF50',
                                            fontWeight: 600,
                                            display: 'block',
                                          }}>
                                            Total: ${(car.vehiclePrice * daysBetween).toFixed(0)} for {daysBetween} days
                                          </Typography>
                                        </Box>

                                        <GradientButton
                                          fullWidth
                                          size="large"
                                          onClick={() => handleBookNow(car.id)}
                                          startIcon={<DirectionsCarIcon />}
                                          sx={{ 
                                            mb: 2,
                                            height: 56,
                                          }}
                                        >
                                          Book Now
                                        </GradientButton>

                                        <Button
                                          fullWidth
                                          variant="outlined"
                                          onClick={() => {
                                            // Add to favorites functionality
                                            setSnackbar({ 
                                              open: true, 
                                              message: 'Added to favorites!', 
                                              severity: 'info' 
                                            });
                                          }}
                                          startIcon={<StarBorderIcon />}
                                          sx={{
                                            borderRadius: 14,
                                            height: 48,
                                            borderColor: '#FF6F61',
                                            color: '#FF6F61',
                                            '&:hover': {
                                              borderColor: '#FF6F61',
                                              background: alpha('#FF6F61', 0.08),
                                            },
                                          }}
                                        >
                                          Save for Later
                                        </Button>
                                      </Box>
                                    </Grid>
                                  </Grid>
                                </CardContent>
                              </GradientCard>
                            </Zoom>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                </CardContent>
              </GradientCard>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ mt: { xs: 6, md: 8 } }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            borderRadius: 16,
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)',
            background: alpha(theme.palette.background.paper, 0.95),
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          }}
          iconMapping={{
            success: <CheckCircleIcon fontSize="large" />,
            error: <WhatshotIcon fontSize="large" />,
            warning: <BoltIcon fontSize="large" />,
            info: <StarIcon fontSize="large" />,
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
            {snackbar.message}
          </Typography>
        </Alert>
      </Snackbar>
    </Box>
  );
}

// Add missing icon import
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";