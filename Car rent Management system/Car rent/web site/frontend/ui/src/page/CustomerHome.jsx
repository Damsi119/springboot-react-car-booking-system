import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Slider,
  Avatar,
  Menu,
  MenuItem as MuiMenuItem,
  Badge,
  ListItem,
  ListItemText,
  ListItemSecondaryAction, // ADD THIS
  Snackbar,
  Alert,
  Grid,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  ThemeProvider,
  createTheme,
  alpha,
  Paper,
  Container,
  Chip,
  Tooltip,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  Menu as MenuIcon,
  DirectionsCar as DirectionsCarIcon,
  BookOnline as BookOnlineIcon,
  Home as HomeIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  AccountCircle as AccountCircleIcon,
  Notifications as NotificationsIcon,
  ContentCopy as ContentCopyIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Speed as SpeedIcon,
  ElectricCar as ElectricCarIcon,
  LocalGasStation as LocalGasStationIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  History as HistoryIcon,
  Whatshot as WhatshotIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  TrendingFlat as TrendingFlatIcon,
  Refresh as RefreshIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { styled, keyframes } from "@mui/material/styles";

// ================= ANIMATIONS & KEYFRAMES =================
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 111, 97, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(255, 111, 97, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 111, 97, 0); }
`;

const shimmerAnimation = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

// ================= STYLED COMPONENTS =================
const GradientCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #FF6F61, #FF8E53, #FF6F61)',
    backgroundSize: '200% 100%',
    animation: `${shimmerAnimation} 3s infinite linear`,
  },
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 25px 50px -12px ${alpha(theme.palette.primary.main, 0.25)}`,
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 8,
    top: 8,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
    animation: `${pulseAnimation} 2s infinite`,
  },
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FF6F61 30%, #FF8E53 90%)',
  border: 0,
  borderRadius: 12,
  color: 'white',
  height: 48,
  padding: '0 30px',
  boxShadow: '0 4px 20px rgba(255, 111, 97, 0.3)',
  fontWeight: 700,
  textTransform: 'none',
  fontSize: '1rem',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    background: 'linear-gradient(45deg, #E55450 30%, #FF7B42 90%)',
    boxShadow: '0 6px 25px rgba(255, 111, 97, 0.4)',
    transform: 'translateY(-2px)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: -100,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: '0.5s',
  },
  '&:hover::after': {
    left: '100%',
  },
  transition: 'all 0.3s ease',
}));

const FloatingActionButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: 30,
  right: 30,
  width: 60,
  height: 60,
  background: 'linear-gradient(45deg, #FF6F61, #FF8E53)',
  color: 'white',
  boxShadow: '0 10px 30px rgba(255, 111, 97, 0.4)',
  zIndex: 1000,
  animation: `${floatAnimation} 3s ease-in-out infinite`,
  '&:hover': {
    background: 'linear-gradient(45deg, #E55450, #FF7B42)',
    transform: 'scale(1.1)',
  },
}));

// ================= MAIN COMPONENT =================
export default function CustomerDashboard() {
  const navigate = useNavigate();

  // ================= DARK MODE STATE =================
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // ================= DARK MODE THEME =================
  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#FF6F61" },
      secondary: { main: "#FF8E53" },
      background: {
        default: darkMode 
          ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)' 
          : 'linear-gradient(135deg, #f8f9ff 0%, #eef2ff 100%)',
        paper: darkMode ? "#1e1e1e" : "#ffffff",
      },
      text: {
        primary: darkMode ? "#ffffff" : "#2d3436",
        secondary: darkMode ? "#b2bec3" : "#636e72",
      },
    },
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h5: {
        fontWeight: 700,
      },
    },
  }), [darkMode]);

  // ================= STATES =================
  const [user, setUser] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(["All Cars"]);
  const [selectedFilter, setSelectedFilter] = useState("All Cars");
  const [fuelFilter, setFuelFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortOption, setSortOption] = useState("None");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem("favorites")) || []);
  const [page, setPage] = useState(1);
  const carsPerPage = 6;
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [anchorNotif, setAnchorNotif] = useState(null);
  const openNotifMenu = Boolean(anchorNotif);
  
  // Profile dialog
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [stats, setStats] = useState({
    totalBookings: 0,
    favoriteCars: 0,
    totalSpent: 0,
    upcomingTrips: 0,
  });

  const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });

  // Profile menu
  const [anchorEl, setAnchorEl] = useState(null);
  const openProfileMenu = Boolean(anchorEl);

  const handleProfileClick = (e) => setAnchorEl(e.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);

  // ================= EFFECTS =================
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (!storedUser || !token || storedUser.role?.replace("ROLE_", "").toUpperCase() !== "USER") {
      navigate("/login");
    } else {
      setUser(storedUser);
      // Simulate fetching user stats
      setStats({
        totalBookings: 12,
        favoriteCars: favorites.length,
        totalSpent: 2450,
        upcomingTrips: 2,
      });
    }
  }, [navigate, favorites.length]);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:4040/cars/all")
      .then((res) => {
        const enhancedCars = (res.data.carList || []).map(car => ({
          ...car,
          rating: (Math.random() * 2 + 3).toFixed(1), // 3-5 stars
          trips: Math.floor(Math.random() * 100),
          instantBook: Math.random() > 0.5,
        }));
        setCars(enhancedCars);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:4040/cars/categories")
      .then((res) => setFilters(["All Cars", ...res.data]))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const localNotifs = JSON.parse(localStorage.getItem("notifications")) || [];

    const fetchBackendNotifs = async () => {
      try {
        // Try alternative endpoint or handle 403 differently
        const res = await axios.get("http://localhost:4040/bookings/user-bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Process bookings to create notifications
        const backendNotifs = Array.isArray(res.data.data) 
          ? res.data.data.map((booking) => ({ 
              code: booking.bookingConfirmationCode || "N/A",
              date: new Date(booking.createdAt).toLocaleString(),
              read: false 
            }))
          : [];
        
        // Combine backend and local, keeping already read ones
        const combined = [
          ...backendNotifs,
          ...localNotifs.map((n) => ({ ...n, read: n.read || false })),
        ];
        setNotifications(combined);
      } catch (err) {
        console.warn("Failed backend fetch, using local notifications.");
        setNotifications(localNotifs.map((n) => ({ ...n, read: n.read || false })));
      }
    };

    fetchBackendNotifs();
  }, [user, navigate]);

  // ================= HANDLERS =================
  const toggleFavorite = (carId) => {
    const updated = favorites.includes(carId)
      ? favorites.filter((id) => id !== carId)
      : [...favorites, carId];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
    setStats(prev => ({ ...prev, favoriteCars: updated.length }));
    setSnack({ 
      open: true, 
      message: favorites.includes(carId) ? "Removed from favorites" : "Added to favorites",
      severity: "success" 
    });
  };

  const filteredCars = cars.filter(
    (c) =>
      (selectedFilter === "All Cars" || c.vehicleCategory === selectedFilter) &&
      (fuelFilter === "All" || c.fuelType === fuelFilter) &&
      c.vehiclePrice >= priceRange[0] &&
      c.vehiclePrice <= priceRange[1] &&
      c.vehicleDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCars = [...filteredCars].sort((a, b) => {
    if (sortOption === "Price: Low → High") return a.vehiclePrice - b.vehiclePrice;
    if (sortOption === "Price: High → Low") return b.vehiclePrice - a.vehiclePrice;
    if (sortOption === "Newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOption === "Rating") return b.rating - a.rating;
    return 0;
  });

  const paginatedCars = sortedCars.slice((page - 1) * carsPerPage, page * carsPerPage);
  const pageCount = Math.ceil(sortedCars.length / carsPerPage);

  const handleBookNow = (carId) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.id;
    if (!userId) return navigate("/login");
    navigate(`/bookings/book-car/${carId}/${userId}`);
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setSnack({ open: true, message: `📋 Copied: ${code}`, severity: "info" });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleQuickSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleRefresh = () => {
    setLoading(true);
    axios
      .get("http://localhost:4040/cars/all")
      .then((res) => {
        const enhancedCars = (res.data.carList || []).map(car => ({
          ...car,
          rating: (Math.random() * 2 + 3).toFixed(1),
          trips: Math.floor(Math.random() * 100),
          instantBook: Math.random() > 0.5,
        }));
        setCars(enhancedCars);
        setSnack({ open: true, message: "🔄 Data refreshed!", severity: "success" });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  // ================= STATISTICS CARDS =================
  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: <BookOnlineIcon />,
      color: "#FF6F61",
      trend: "+12%",
    },
    {
      title: "Favorite Cars",
      value: stats.favoriteCars,
      icon: <FavoriteIcon />,
      color: "#E91E63",
      trend: "+5",
    },
    {
      title: "Total Spent",
      value: `$${stats.totalSpent}`,
      icon: <TrendingUpIcon />,
      color: "#4CAF50",
      trend: "+8%",
    },
    {
      title: "Upcoming Trips",
      value: stats.upcomingTrips,
      icon: <CalendarTodayIcon />,
      color: "#2196F3",
      trend: "2 active",
    },
  ];

  // ================= QUICK FILTERS =================
  const quickFilters = [
    { label: "Electric", icon: <ElectricCarIcon />, type: "fuel", value: "Electric" },
    { label: "Luxury", icon: <StarIcon />, type: "category", value: "Luxury" },
    { label: "Fast Delivery", icon: <SpeedIcon />, type: "feature", value: "instant" },
    { label: "Discount", icon: <WhatshotIcon />, type: "discount", value: true },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        display: "flex", 
        width: "100vw", 
        minHeight: "100vh",
        background: theme.palette.background.default,
        color: theme.palette.text.primary,
        overflow: 'hidden',
      }}>
        {/* ================= SIDEBAR ================= */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <Box
            sx={{
              width: sidebarOpen ? { xs: 280, md: 320 } : 80,
              height: '100vh',
              bgcolor: darkMode ? '#1a1a1a' : '#ffffff',
              borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "sticky",
              top: 0,
              boxShadow: '0 0 40px rgba(0,0,0,0.1)',
              zIndex: 1200,
            }}
          >
            {/* Logo Section */}
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: 12,
                background: 'linear-gradient(45deg, #FF6F61, #FF8E53)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: `${floatAnimation} 3s ease-in-out infinite`,
              }}>
                <DirectionsCarIcon sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 800, background: 'linear-gradient(45deg, #FF6F61, #FF8E53)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                   PremiumRentals
                  </Typography>
                </motion.div>
              )}
            </Box>

            <Divider sx={{ mx: 3 }} />

            {/* Navigation */}
            <Box sx={{ px: 2, flex: 1 }}>
              {[
                { icon: <HomeIcon />, label: "Dashboard", path: "/customer-home" },
                { icon: <DirectionsCarIcon />, label: "Browse Cars", path: "/availableCarsForm" },
                { icon: <BookOnlineIcon />, label: "My Bookings", path: "/my-bookings" },
                { icon: <HistoryIcon />, label: "History", path: "/history" },
                { icon: <FavoriteIcon />, label: "Favorites", path: "/favorites" },
                { icon: <SettingsIcon />, label: "Settings", path: "/settings" },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    startIcon={item.icon}
                    onClick={() => navigate(item.path)}
                    sx={{
                      width: '100%',
                      justifyContent: sidebarOpen ? 'flex-start' : 'center',
                      py: 1.5,
                      px: sidebarOpen ? 3 : 2,
                      mb: 1,
                      borderRadius: 2,
                      color: theme.palette.text.secondary,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </Button>
                </motion.div>
              ))}
            </Box>

            {/* User Section */}
            <Box sx={{ p: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: '#FF6F61',
                    color: 'white',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  onClick={handleProfileClick}
                >
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </Avatar>
                {sidebarOpen && (
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {user?.username || "User"}
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      {user?.email || "user@example.com"}
                    </Typography>
                  </Box>
                )}
                <IconButton
                  size="small"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  sx={{ color: theme.palette.text.secondary }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* ================= MAIN CONTENT ================= */}
        <Box sx={{ flex: 1, overflow: 'auto', position: 'relative' }}>
          {/* Background Pattern */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: darkMode 
              ? `radial-gradient(circle at 20% 80%, ${alpha('#FF6F61', 0.05)} 0%, transparent 50%)`
              : `radial-gradient(circle at 20% 80%, ${alpha('#FF6F61', 0.03)} 0%, transparent 50%)`,
            pointerEvents: 'none',
            zIndex: 0,
          }} />

          <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
            {/* ================= HEADER ================= */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
                <Grid item size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography variant="h3" sx={{ 
                      fontWeight: 800, 
                      mb: 1,
                      background: 'linear-gradient(45deg, #FF6F61, #FF8E53)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      Welcome back, {user?.username || "Driver"}! 👋
                    </Typography>
                    <Typography variant="h6" sx={{ 
                      color: theme.palette.text.secondary,
                      fontWeight: 400,
                    }}>
                      Ready for your next adventure?
                    </Typography>
                  </Box>
                </Grid>
                <Grid item size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
                    {/* Time Display */}
                    <Paper sx={{ 
                      p: 2, 
                      borderRadius: 3,
                      bgcolor: alpha(theme.palette.background.paper, 0.7),
                      backdropFilter: 'blur(10px)',
                      minWidth: 200,
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <AccessTimeIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                          {currentTime.toLocaleDateString('en-US', { weekday: 'long' })}
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        {currentTime.toLocaleDateString()}
                      </Typography>
                    </Paper>

                    {/* Notification Bell */}
                    <Tooltip title="Notifications">
                      <IconButton 
                        onClick={(e) => setAnchorNotif(e.currentTarget)}
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                        }}
                      >
                        <StyledBadge badgeContent={unreadCount} color="error">
                          <NotificationsIcon sx={{ color: theme.palette.primary.main }} />
                        </StyledBadge>
                      </IconButton>
                    </Tooltip>

                    {/* Dark Mode Toggle */}
                    <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                      <IconButton
                        onClick={() => setDarkMode(!darkMode)}
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                        }}
                      >
                        {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                      </IconButton>
                    </Tooltip>

                    {/* Refresh Button */}
                    <Tooltip title="Refresh Data">
                      <span> {/* Wrapper to fix disabled tooltip warning */}
                        <IconButton
                          onClick={handleRefresh}
                          disabled={loading}
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) },
                            '&.Mui-disabled': {
                              opacity: 0.5,
                            }
                          }}
                        >
                          <RefreshIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                </Grid>
              </Grid>
            </motion.div>

            {/* ================= STATISTICS ================= */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {statCards.map((stat, index) => (
                  <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                    <GradientCard>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ 
                            width: 48, 
                            height: 48, 
                            borderRadius: 12,
                            bgcolor: alpha(stat.color, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            {React.cloneElement(stat.icon, { sx: { color: stat.color, fontSize: 24 } })}
                          </Box>
                          <Chip 
                            label={stat.trend} 
                            size="small" 
                            sx={{ 
                              bgcolor: alpha(stat.color, 0.1), 
                              color: stat.color,
                              fontWeight: 600,
                            }} 
                          />
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                          {stat.title}
                        </Typography>
                      </CardContent>
                    </GradientCard>
                  </Grid>
                ))}
              </Grid>
            </motion.div>

            {/* ================= QUICK FILTERS ================= */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Paper sx={{ 
                p: 3, 
                mb: 4, 
                borderRadius: 3,
                bgcolor: alpha(theme.palette.background.paper, 0.7),
                backdropFilter: 'blur(10px)',
              }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FilterListIcon />
                  Quick Filters
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  {quickFilters.map((filter, index) => (
                    <motion.div
                      key={filter.label}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Chip
                        icon={filter.icon}
                        label={filter.label}
                        onClick={() => handleQuickSearch(filter.label.toLowerCase())}
                        sx={{
                          px: 2,
                          py: 2,
                          fontSize: '0.9rem',
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) },
                        }}
                      />
                    </motion.div>
                  ))}
                </Stack>
              </Paper>
            </motion.div>

            {/* ================= SEARCH & FILTERS ================= */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Paper sx={{ 
                p: 3, 
                mb: 4, 
                borderRadius: 3,
                bgcolor: alpha(theme.palette.background.paper, 0.7),
                backdropFilter: 'blur(10px)',
              }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      placeholder="Search cars by name, model, or features..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: theme.palette.primary.main }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          bgcolor: theme.palette.background.paper,
                        }
                      }}
                    />
                  </Grid>
                  <Grid item size={{ xs: 12, md: 2 }}>
                    <TextField
                      select
                      fullWidth
                      label="Category"
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          bgcolor: theme.palette.background.paper,
                        }
                      }}
                    >
                      {filters.map((f, i) => (
                        <MenuItem key={i} value={f}>{f}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item size={{ xs: 12, md: 2 }}>
                    <TextField
                      select
                      fullWidth
                      label="Fuel Type"
                      value={fuelFilter}
                      onChange={(e) => setFuelFilter(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          bgcolor: theme.palette.background.paper,
                        }
                      }}
                    >
                      {["All", "Petrol", "Diesel", "Electric", "Hybrid"].map((f, i) => (
                        <MenuItem key={i} value={f}>{f}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item size={{ xs: 12, md: 2 }}>
                    <TextField
                      select
                      fullWidth
                      label="Sort By"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          bgcolor: theme.palette.background.paper,
                        }
                      }}
                    >
                      {["None", "Price: Low → High", "Price: High → Low", "Newest", "Rating"].map((option, i) => (
                        <MenuItem key={i} value={option}>{option}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item size={{ xs: 12, md: 2 }}>
                    <ToggleButtonGroup
                      value={viewMode}
                      exclusive
                      onChange={(e, newMode) => newMode && setViewMode(newMode)}
                      sx={{
                        width: '100%',
                        '& .MuiToggleButton-root': {
                          flex: 1,
                          borderRadius: 3,
                          borderColor: theme.palette.divider,
                        }
                      }}
                    >
                      <ToggleButton value="grid">
                        <DashboardIcon />
                      </ToggleButton>
                      <ToggleButton value="list">
                        <FilterListIcon />
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Grid>
                </Grid>

                {/* Price Range Slider */}
                <Box sx={{ mt: 3 }}>
                  <Typography gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingFlatIcon />
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </Typography>
                  <Slider
                    value={priceRange}
                    onChange={(e, newValue) => setPriceRange(newValue)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={100000}
                    step={1000}
                    sx={{
                      color: theme.palette.primary.main,
                      '& .MuiSlider-valueLabel': {
                        bgcolor: theme.palette.primary.main,
                        borderRadius: 2,
                      }
                    }}
                  />
                </Box>
              </Paper>
            </motion.div>

            {/* ================= CARS GRID/LIST ================= */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Available Cars ({sortedCars.length})
                  </Typography>
                  {loading && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} />
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        Loading...
                      </Typography>
                    </Box>
                  )}
                </Box>

                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
                    <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
                  </Box>
                ) : sortedCars.length === 0 ? (
                  <Paper sx={{ 
                    p: 8, 
                    textAlign: 'center', 
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.background.paper, 0.7),
                    backdropFilter: 'blur(10px)',
                  }}>
                    <DirectionsCarIcon sx={{ fontSize: 80, color: theme.palette.text.disabled, mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      No cars found
                    </Typography>
                    <Typography sx={{ color: theme.palette.text.secondary, mb: 3 }}>
                      Try adjusting your search filters or browse all cars
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setSelectedFilter("All Cars");
                        setFuelFilter("All");
                        setPriceRange([0, 100000]);
                        setSearchQuery("");
                      }}
                    >
                      Reset Filters
                    </Button>
                  </Paper>
                ) : viewMode === 'grid' ? (
                  <Grid container spacing={3}>
                    {paginatedCars.map((car, i) => (
                      <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={car.id}>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: i * 0.05 }}
                          whileHover={{ y: -5 }}
                        >
                          <GradientCard>
                            <Box sx={{ position: 'relative' }}>
                              {/* Car Image */}
                              <Box sx={{ 
                                height: 200, 
                                overflow: 'hidden',
                                position: 'relative',
                                '&:hover img': {
                                  transform: 'scale(1.1)',
                                }
                              }}>
                                <img 
                                  src={car.vehiclePhotoURL} 
                                  alt={car.vehicleDescription}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.5s ease',
                                  }}
                                />
                                {/* Overlay Gradient */}
                                <Box sx={{
                                  position: 'absolute',
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  height: '60%',
                                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                }} />
                              </Box>

                              {/* Price Badge */}
                              <Chip
                                label={`$${car.vehiclePrice}/day`}
                                sx={{
                                  position: 'absolute',
                                  top: 16,
                                  right: 16,
                                  bgcolor: theme.palette.primary.main,
                                  color: 'white',
                                  fontWeight: 700,
                                  fontSize: '0.875rem',
                                }}
                              />

                              {/* Favorite Button */}
                              <IconButton
                                onClick={() => toggleFavorite(car.id)}
                                sx={{
                                  position: 'absolute',
                                  top: 16,
                                  left: 16,
                                  bgcolor: 'rgba(0,0,0,0.5)',
                                  color: favorites.includes(car.id) ? '#FF6F61' : 'white',
                                  '&:hover': {
                                    bgcolor: 'rgba(0,0,0,0.7)',
                                  }
                                }}
                              >
                                {favorites.includes(car.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                              </IconButton>

                              {/* Instant Book Badge */}
                              {car.instantBook && (
                                <Chip
                                  icon={<CheckCircleIcon />}
                                  label="Instant Book"
                                  size="small"
                                  sx={{
                                    position: 'absolute',
                                    bottom: 16,
                                    left: 16,
                                    bgcolor: '#4CAF50',
                                    color: 'white',
                                    fontWeight: 600,
                                  }}
                                />
                              )}
                            </Box>

                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box>
                                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                    {car.vehicleDescription}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                    {car.vehicleCategory} • {car.fuelType}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <StarIcon sx={{ fontSize: 18, color: '#FFC107' }} />
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {car.rating}
                                  </Typography>
                                </Box>
                              </Box>

                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Chip
                                  icon={<LocalGasStationIcon />}
                                  label={car.fuelType}
                                  size="small"
                                  variant="outlined"
                                />
                                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                  {car.trips} trips
                                </Typography>
                              </Box>

                              <AnimatedButton
                                fullWidth
                                onClick={() => handleBookNow(car.id)}
                                startIcon={<DirectionsCarIcon />}
                              >
                                Book Now
                              </AnimatedButton>
                            </CardContent>
                          </GradientCard>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  /* List View */
                  <Stack spacing={2}>
                    {paginatedCars.map((car, i) => (
                      <motion.div
                        key={car.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                      >
                        <GradientCard>
                          <Box sx={{ display: 'flex', p: 3 }}>
                            {/* Car Image */}
                            <Box sx={{ 
                              width: 200, 
                              height: 150, 
                              borderRadius: 2,
                              overflow: 'hidden',
                              mr: 3,
                              flexShrink: 0,
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
                            </Box>

                            {/* Car Details */}
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                <Box>
                                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                    {car.vehicleDescription}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                                    {car.vehicleCategory} • {car.fuelType}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="h5" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
                                    ${car.vehiclePrice}
                                    <Typography component="span" variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                      /day
                                    </Typography>
                                  </Typography>
                                </Box>
                              </Box>

                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <StarIcon sx={{ fontSize: 16, color: '#FFC107' }} />
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {car.rating} ({car.trips} trips)
                                  </Typography>
                                </Box>
                                {car.instantBook && (
                                  <Chip
                                    icon={<CheckCircleIcon />}
                                    label="Instant Book"
                                    size="small"
                                    sx={{ bgcolor: alpha('#4CAF50', 0.1), color: '#4CAF50' }}
                                  />
                                )}
                              </Box>

                              <Box sx={{ display: 'flex', gap: 2 }}>
                                <IconButton
                                  onClick={() => toggleFavorite(car.id)}
                                  sx={{ 
                                    color: favorites.includes(car.id) ? '#FF6F61' : theme.palette.text.secondary,
                                  }}
                                >
                                  {favorites.includes(car.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                </IconButton>
                                <AnimatedButton
                                  onClick={() => handleBookNow(car.id)}
                                  sx={{ minWidth: 140 }}
                                >
                                  Book Now
                                </AnimatedButton>
                              </Box>
                            </Box>
                          </Box>
                        </GradientCard>
                      </motion.div>
                    ))}
                  </Stack>
                )}
              </Box>
            </motion.div>

            {/* ================= PAGINATION ================= */}
            {pageCount > 1 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={pageCount}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        borderRadius: 2,
                        fontWeight: 600,
                      },
                      '& .Mui-selected': {
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        color: 'white',
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                      },
                    }}
                  />
                </Box>
              </motion.div>
            )}
          </Container>

          {/* ================= FLOATING ACTION BUTTON ================= */}
          <FloatingActionButton onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <TrendingUpIcon />
          </FloatingActionButton>
        </Box>

        {/* ================= NOTIFICATIONS MENU ================= */}
        <Menu
          anchorEl={anchorNotif}
          open={openNotifMenu}
          onClose={() => setAnchorNotif(null)}
          PaperProps={{
            sx: {
              width: 320,
              maxHeight: 400,
              mt: 1,
              borderRadius: 3,
              bgcolor: theme.palette.background.paper,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            }
          }}
        >
          <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Notifications
              {unreadCount > 0 && (
                <Chip 
                  label={`${unreadCount} new`} 
                  size="small" 
                  color="error" 
                  sx={{ ml: 1, fontSize: '0.75rem' }} 
                />
              )}
            </Typography>
          </Box>
          {notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <NotificationsIcon sx={{ fontSize: 48, color: theme.palette.text.disabled, mb: 2 }} />
              <Typography sx={{ color: theme.palette.text.secondary }}>
                No notifications yet
              </Typography>
            </Box>
          ) : (
            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              {notifications.map((notif, i) => (
                <ListItem
                  key={i}
                  sx={{
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.05) },
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: notif.read ? 400 : 700 }}>
                          Booking Confirmed
                        </Typography>
                        {!notif.read && (
                          <Box sx={{ 
                            width: 8, 
                            height: 8, 
                            borderRadius: '50%', 
                            bgcolor: theme.palette.primary.main,
                          }} />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                          Code: {notif.code}
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
                          {notif.date}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton size="small" onClick={() => copyToClipboard(notif.code)}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </Box>
          )}
          {notifications.length > 0 && (
            <Box sx={{ p: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
              <Button
                fullWidth
                onClick={() => {
                  setNotifications([]);
                  localStorage.setItem("notifications", JSON.stringify([]));
                }}
                sx={{ borderRadius: 2 }}
              >
                Clear All
              </Button>
            </Box>
          )}
        </Menu>

        {/* ================= PROFILE DIALOG ================= */}
        <Dialog
          open={openProfileDialog}
          onClose={() => setOpenProfileDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              bgcolor: theme.palette.background.paper,
              backdropFilter: 'blur(10px)',
            }
          }}
        >
          <DialogTitle sx={{ textAlign: 'center', pb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              My Profile
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  fontSize: 36,
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  margin: '0 auto 20px',
                  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              >
                {user?.username?.charAt(0)?.toUpperCase()}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                {user?.username}
              </Typography>
              <Typography sx={{ color: theme.palette.text.secondary, mb: 3 }}>
                {user?.email}
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 4 }}>
              {statCards.map((stat, index) => (
                <Grid item size={6} key={index}>
                  <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: stat.color }}>
                      {stat.value}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
              sx={{
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #FF6F61, #FF8E53)',
                fontWeight: 700,
                fontSize: '1rem',
              }}
            >
              Logout
            </Button>
          </DialogContent>
        </Dialog>

        {/* ================= SNACKBAR ================= */}
        <Snackbar
          open={snack.open}
          autoHideDuration={3000}
          onClose={() => setSnack({ ...snack, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnack({ ...snack, open: false })}
            severity={snack.severity}
            sx={{
              width: '100%',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>
              {snack.message}
            </Typography>
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}