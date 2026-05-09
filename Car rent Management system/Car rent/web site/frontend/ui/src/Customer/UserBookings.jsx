import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  Stack,
  Divider,
  Tooltip,
  alpha,
  useTheme,
  LinearProgress,
  Skeleton,
  Container,
  useMediaQuery,
  CardContent,
  CardMedia,
  CardActions,
  AvatarGroup,
  Avatar,
  Fade
} from "@mui/material";
import {
  CalendarMonth,
  DirectionsCar,
  Person,
  ChildCare,
  Close,
  Download,
  FilterAlt,
  Refresh,
  CheckCircle,
  Warning,
  Star,
  Receipt,
  MoreVert,
  ArrowForward,
  LocationOn,
  Speed,
  LocalGasStation,
  People,
  Cancel,
  VerifiedUser,
  DarkMode,
  LightMode,
  ViewCarousel,
  Share,
  SupportAgent,
  Menu,
  ArrowRightAlt,
  AccessTime,
  Payment,
  TrendingUp,
  Check
} from "@mui/icons-material";

// Helper functions
const getStatusColor = (status) => {
  switch (status) {
    case "confirmed": return "success";
    case "completed": return "info";
    case "cancelled": return "error";
    case "pending": return "warning";
    default: return "default";
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
};

// Separate components for better organization
const StatCard = ({ label, value, change, icon, color, darkMode }) => (
  <Card sx={{
    borderRadius: 3,
    bgcolor: darkMode ? 'grey.900' : 'white',
    border: `1px solid ${darkMode ? 'grey.800' : 'grey.100'}`,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    height: '100%',
    transition: 'transform 0.2s',
    '&:hover': { transform: 'translateY(-4px)' }
  }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ 
          p: 1.5, 
          borderRadius: 2,
          bgcolor: alpha(color, 0.1),
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </Box>
        {change && (
          <Chip
            label={change}
            size="small"
            color="success"
            variant="outlined"
            icon={<TrendingUp sx={{ fontSize: 14 }} />}
          />
        )}
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, fontSize: { xs: '1.75rem', md: '2rem' } }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ 
        color: darkMode ? 'grey.400' : 'grey.600',
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontSize: '0.75rem',
        fontWeight: 500
      }}>
        {label}
      </Typography>
    </CardContent>
  </Card>
);

const BookingCard = ({ booking, darkMode, onViewDetails, onDownloadInvoice, onCancel, loadingDetails }) => (
  <Fade in timeout={300}>
    <Card sx={{
      borderRadius: 3,
      bgcolor: darkMode ? 'grey.900' : 'white',
      border: `1px solid ${darkMode ? 'grey.800' : 'grey.100'}`,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        transform: 'translateY(-2px)'
      },
      overflow: 'hidden'
    }}>
      <Box sx={{ position: 'relative', flexShrink: 0 }}>
        <CardMedia
          component="img"
          height="160"
          image={booking.vehicleImage}
          alt={booking.carModel}
          sx={{ 
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        />
        <Chip
          label={booking.status.toUpperCase()}
          color={getStatusColor(booking.status)}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            fontWeight: 600,
            backdropFilter: 'blur(4px)',
            bgcolor: alpha('#000', 0.7)
          }}
        />
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
          p: 2,
          color: 'white'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {booking.carMake} {booking.carModel}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOn sx={{ fontSize: 14 }} />
            {booking.location}
          </Typography>
        </Box>
      </Box>
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
              ${booking.price}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Star sx={{ fontSize: 14, color: 'warning.main' }} />
              {booking.dailyRate}/day
            </Typography>
          </Box>

          <Divider />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                CHECK-IN
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                {formatDate(booking.checkInDate)}
              </Typography>
            </Box>
            <ArrowRightAlt sx={{ color: 'action.active' }} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                CHECK-OUT
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                {formatDate(booking.checkOutDate)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person fontSize="small" color="action" />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {booking.numOfAdults}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ChildCare fontSize="small" color="action" />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {booking.numOfChildren}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </CardContent>
      
      <Divider sx={{ flexShrink: 0 }} />
      
      <CardActions sx={{ p: 2, flexShrink: 0, justifyContent: 'space-between' }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<Receipt />}
          onClick={() => onDownloadInvoice(booking.id)}
          disabled={loadingDetails[booking.id]}
        >
          Invoice
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => onViewDetails(booking)}
        >
          Details
        </Button>
        {booking.status === 'confirmed' && (
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={() => onCancel(booking)}
            startIcon={<Cancel />}
          >
            Cancel
          </Button>
        )}
      </CardActions>
    </Card>
  </Fade>
);

export default function UserBookings() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [cancelDialog, setCancelDialog] = useState({ open: false, booking: null });
  const [detailsDrawer, setDetailsDrawer] = useState({ open: false, booking: null });
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    totalSpent: 0,
    favoriteCar: ""
  });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // SIMPLIFIED flattenBookings function - remove complex logic
  const flattenBookings = useCallback((data) => {
    console.log("🚨 DEBUG flattenBookings - Raw API data:", data);
    
    // If data is already an array, return it directly with minimal processing
    if (Array.isArray(data)) {
      console.log("✅ Data is an array with", data.length, "items");
      
      return data.map((booking, index) => {
        console.log(`📦 Processing booking ${index}:`, booking);
        
        // Extract car info (handle nested structure)
        const car = booking.car || {};
        
        // Calculate days and daily rate
        const checkIn = new Date(booking.checkInDate || booking.startDate || new Date());
        const checkOut = new Date(booking.checkOutDate || booking.endDate || new Date(Date.now() + 86400000));
        const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)) || 1;
        const price = booking.totalPrice || booking.price || 1500;
        const dailyRate = (price / days).toFixed(2);
        
        return {
          id: booking.id || `booking-${index}`,
          bookingConfirmationCode: booking.bookingConfirmationCode || booking.confirmationCode || `CONF-${index}`,
          vehicleDescription: car.vehicleDescription || booking.vehicleDescription || "Premium Vehicle",
          vehicleImage: car.images?.[0] || car.image || booking.image || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=400&fit=crop",
          carModel: car.model || booking.carModel || booking.model || "Luxury Sedan",
          carMake: car.make || booking.carMake || booking.make || "Premium Brand",
          carType: car.type || booking.carType || booking.type || "SUV",
          price: price,
          dailyRate: dailyRate,
          checkInDate: booking.checkInDate || booking.startDate || new Date().toISOString(),
          checkOutDate: booking.checkOutDate || booking.endDate || new Date(Date.now() + 86400000).toISOString(),
          numOfAdults: booking.numOfAdults || booking.adults || 2,
          numOfChildren: booking.numOfChildren || booking.children || 0,
          status: booking.status || "confirmed",
          createdAt: booking.createdAt || booking.bookingDate || new Date().toISOString(),
          rating: booking.rating || null,
          features: {
            transmission: car.transmission || booking.transmission || "Automatic",
            fuelType: car.fuelType || booking.fuelType || "Premium",
            seats: car.seats || booking.seats || 5,
            luggage: car.luggage || booking.luggage || 2
          },
          location: car.location || booking.location || "Downtown Premium",
          insurance: booking.insurance || "Full Coverage",
          paymentStatus: booking.paymentStatus || "paid",
          cancellationPolicy: booking.cancellationPolicy || "Free cancellation up to 48 hours",
          pickupTime: booking.pickupTime || "14:00",
          dropoffTime: booking.dropoffTime || "11:00"
        };
      });
    }
    
    // If data is an object, check for nested arrays
    if (data && typeof data === 'object') {
      console.log("🔍 Data is an object, checking for nested arrays...");
      
      // Check common keys for bookings array
      const possibleKeys = ['data', 'bookings', 'results', 'items', 'list', 'carList'];
      
      for (const key of possibleKeys) {
        if (Array.isArray(data[key])) {
          console.log(`✅ Found array in data.${key} with ${data[key].length} items`);
          return flattenBookings(data[key]);
        }
      }
      
      // Check all object values for arrays
      const values = Object.values(data);
      for (const value of values) {
        if (Array.isArray(value)) {
          console.log(`✅ Found array in object values with ${value.length} items`);
          return flattenBookings(value);
        }
      }
      
      // If no array found but object has booking properties, wrap in array
      if (data.id || data.bookingConfirmationCode) {
        console.log("📦 Object has booking properties, wrapping in array");
        return flattenBookings([data]);
      }
    }
    
    console.log("❌ Could not extract bookings from data");
    return [];
  }, []);

  const calculateStats = useCallback((bookingsList) => {
    console.log("📊 calculateStats called with:", bookingsList.length, "bookings");
    
    const upcoming = bookingsList.filter(b => 
      new Date(b.checkInDate) > new Date() && b.status === "confirmed"
    ).length;
    
    const completed = bookingsList.filter(b => 
      new Date(b.checkOutDate) < new Date() && b.status === "completed"
    ).length;
    
    const cancelled = bookingsList.filter(b => b.status === "cancelled").length;
    const totalSpent = bookingsList.reduce((sum, b) => sum + (b.price || 0), 0);
    
    const carCounts = {};
    bookingsList.forEach(b => {
      const carKey = `${b.carMake} ${b.carModel}`;
      carCounts[carKey] = (carCounts[carKey] || 0) + 1;
    });
    
    const favoriteCar = Object.keys(carCounts).length > 0 
      ? Object.keys(carCounts).reduce((a, b) => carCounts[a] > carCounts[b] ? a : b)
      : "None";

    setStats({
      total: bookingsList.length,
      upcoming,
      completed,
      cancelled,
      totalSpent,
      favoriteCar
    });
    
    console.log("📈 Stats calculated:", {
      total: bookingsList.length,
      upcoming,
      completed,
      cancelled,
      totalSpent,
      favoriteCar
    });
  }, []);

  const fetchBookings = useCallback(async () => {
    console.log("🔄 fetchBookings called");
    
    if (!token) {
      console.error("❌ No token found");
      setSnackbar({
        open: true,
        message: "Please login again",
        severity: "error",
      });
      return;
    }
    
    if (!user) {
      console.error("❌ No user found");
      return;
    }
    
    setLoading(true);

    try {
      console.log("🌐 Making API request to: http://localhost:4040/users/my-bookings");
      console.log("🔑 Using token:", token.substring(0, 20) + "...");
      
      const res = await axios.get("http://localhost:4040/users/my-bookings", {
        headers: { 
          Authorization: `Bearer ${token}`
        },
      });

      console.log("✅ API Response status:", res.status);
      console.log("📦 Full API Response:", res.data);
      console.log("📊 Response data type:", typeof res.data);
      console.log("🔍 Is array?", Array.isArray(res.data));
      
      if (res.data && typeof res.data === 'object') {
        console.log("🔑 Object keys:", Object.keys(res.data));
      }

      const allBookings = flattenBookings(res.data);
      
      console.log("🎯 After flattening - allBookings:", allBookings);
      console.log("🎯 After flattening - length:", allBookings.length);
      
      setBookings(allBookings);
      calculateStats(allBookings);
      setFilteredBookings(allBookings);
      
      // Show success message
      setSnackbar({ 
        open: true, 
        message: `Loaded ${allBookings.length} bookings`, 
        severity: "success" 
      });
      
    } catch (err) {
      console.error("❌ Fetch error:", err);
      console.error("📞 Error response:", err.response?.data);
      console.error("📞 Error status:", err.response?.status);
      
      setSnackbar({
        open: true,
        message: err.response?.data?.message || `Failed to fetch bookings: ${err.message}`,
        severity: "error",
      });
      
      // Test with sample data if API fails
      const sampleBookings = [
        {
          id: 1,
          bookingConfirmationCode: "TEST-001",
          carModel: "Tesla Model 3",
          carMake: "Tesla",
          price: 1500,
          dailyRate: "500",
          checkInDate: new Date().toISOString(),
          checkOutDate: new Date(Date.now() + 86400000 * 3).toISOString(),
          status: "confirmed",
          numOfAdults: 2,
          numOfChildren: 1,
          vehicleImage: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=400&fit=crop",
          location: "New York",
        },
        {
          id: 2,
          bookingConfirmationCode: "TEST-002",
          carModel: "BMW X5",
          carMake: "BMW",
          price: 2000,
          dailyRate: "667",
          checkInDate: new Date(Date.now() + 86400000 * 7).toISOString(),
          checkOutDate: new Date(Date.now() + 86400000 * 10).toISOString(),
          status: "confirmed",
          numOfAdults: 4,
          numOfChildren: 0,
          vehicleImage: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=400&fit=crop",
          location: "Los Angeles",
        }
      ];
      
      console.log("🧪 Using sample bookings for testing");
      setBookings(sampleBookings);
      calculateStats(sampleBookings);
      setFilteredBookings(sampleBookings);
      
    } finally {
      setLoading(false);
    }
  }, [token, user, flattenBookings, calculateStats]);

  const handleCancelBooking = useCallback(async () => {
    if (!token || !cancelDialog.booking) return;

    try {
      setLoadingDetails(prev => ({ ...prev, [cancelDialog.booking.id]: true }));
      const res = await axios.delete(
        `http://localhost:4040/bookings/cancel/${cancelDialog.booking.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSnackbar({ 
        open: true, 
        message: res.data.message, 
        severity: "success" 
      });
      fetchBookings();
      setCancelDialog({ open: false, booking: null });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to cancel booking",
        severity: "error",
      });
    } finally {
      setLoadingDetails(prev => ({ ...prev, [cancelDialog.booking.id]: false }));
    }
  }, [cancelDialog.booking, token, fetchBookings]);

  const handleDownloadInvoice = useCallback(async (bookingId) => {
    try {
      setLoadingDetails(prev => ({ ...prev, [bookingId]: true }));
      const res = await axios.get(
        `http://localhost:4040/bookings/invoice/${bookingId}`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setSnackbar({ 
        open: true, 
        message: "Invoice downloaded successfully", 
        severity: "success" 
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to download invoice",
        severity: "error",
      });
    } finally {
      setLoadingDetails(prev => ({ ...prev, [bookingId]: false }));
    }
  }, [token]);

  const filterAndSortBookings = useCallback(() => {
    console.log("🔍 filterAndSortBookings called");
    console.log("📊 Total bookings:", bookings.length);
    
    let filtered = [...bookings];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(b =>
        (b.carModel && b.carModel.toLowerCase().includes(query)) ||
        (b.carMake && b.carMake.toLowerCase().includes(query)) ||
        (b.bookingConfirmationCode && b.bookingConfirmationCode.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(b => b.status === statusFilter);
    }

    // Tab filter
    switch (activeTab) {
      case 1: // Upcoming
        filtered = filtered.filter(b => new Date(b.checkInDate) > new Date() && b.status === "confirmed");
        break;
      case 2: // Completed
        filtered = filtered.filter(b => new Date(b.checkOutDate) < new Date() && b.status === "completed");
        break;
      case 3: // Cancelled
        filtered = filtered.filter(b => b.status === "cancelled");
        break;
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date_desc":
          return new Date(b.checkInDate) - new Date(a.checkInDate);
        case "date_asc":
          return new Date(a.checkInDate) - new Date(b.checkInDate);
        case "price_desc":
          return (b.price || 0) - (a.price || 0);
        case "price_asc":
          return (a.price || 0) - (b.price || 0);
        default:
          return 0;
      }
    });

    console.log("✅ After filtering - filtered bookings:", filtered.length);
    return filtered;
  }, [bookings, activeTab, statusFilter, sortBy, searchQuery]);

  useEffect(() => {
    console.log("🔄 filterAndSortBookings effect triggered");
    const filtered = filterAndSortBookings();
    setFilteredBookings(filtered);
  }, [filterAndSortBookings]);

  useEffect(() => {
    console.log("🚀 Component mounted, fetching bookings...");
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed": return <CheckCircle />;
      case "completed": return <VerifiedUser />;
      case "cancelled": return <Cancel />;
      case "pending": return <AccessTime />;
      default: return <CalendarMonth />;
    }
  };

  const statsData = [
    { 
      label: 'Total Bookings', 
      value: stats.total, 
      change: stats.total > 0 ? '+12%' : '', 
      icon: <DirectionsCar />,
      color: '#3b82f6' 
    },
    { 
      label: 'Upcoming', 
      value: stats.upcoming, 
      change: stats.upcoming > 0 ? '+5%' : '', 
      icon: <CalendarMonth />,
      color: '#10b981' 
    },
    { 
      label: 'Total Spent', 
      value: formatCurrency(stats.totalSpent), 
      change: stats.totalSpent > 0 ? '+18%' : '', 
      icon: <Payment />,
      color: '#f59e0b' 
    },
    { 
      label: 'Favorite Model', 
      value: stats.favoriteCar, 
      change: '', 
      icon: <Star />,
      color: '#8b5cf6' 
    },
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: darkMode ? 'grey.950' : 'grey.50',
      transition: 'background-color 0.3s ease',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Debug Panel */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ 
          bgcolor: 'rgba(255, 165, 0, 0.1)', 
          p: 1, 
          borderBottom: '1px solid orange',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'orange' }}>
            🐛 DEBUG: Bookings={bookings.length} | Filtered={filteredBookings.length} | Loading={loading.toString()}
          </Typography>
          <Button 
            size="small" 
            variant="outlined"
            onClick={() => {
              console.log("📊 Current state:", { bookings, filteredBookings, stats });
              fetchBookings(); // Re-fetch
            }}
            sx={{ fontSize: '0.7rem', py: 0 }}
          >
            Refresh & Log
          </Button>
        </Box>
      )}
      
      <Container maxWidth="xl" sx={{ 
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        py: { xs: 2, md: 4 }
      }}>
        {/* Header */}
        <Box sx={{ mb: 6, flexShrink: 0 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', md: 'center' },
            mb: 4,
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3
          }}>
            <Box>
              <Typography variant="h3" sx={{ 
                fontWeight: 900,
                background: darkMode 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                  : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
                fontSize: { xs: '2rem', md: '2.75rem' }
              }}>
                Booking Dashboard
              </Typography>
              <Typography variant="h6" sx={{ 
                color: darkMode ? 'grey.400' : 'grey.600',
                fontWeight: 400,
                fontSize: { xs: '1rem', md: '1.25rem' }
              }}>
                Manage all your premium car rentals
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={2} alignItems="center">
              <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"}>
                <IconButton
                  onClick={() => setDarkMode(!darkMode)}
                  sx={{
                    bgcolor: darkMode ? 'grey.800' : 'grey.100',
                    color: darkMode ? 'grey.300' : 'grey.700',
                    border: `1px solid ${darkMode ? 'grey.700' : 'grey.200'}`,
                    '&:hover': {
                      bgcolor: darkMode ? 'grey.700' : 'grey.200'
                    }
                  }}
                >
                  {darkMode ? <LightMode /> : <DarkMode />}
                </IconButton>
              </Tooltip>
              
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={fetchBookings}
                sx={{
                  background: darkMode 
                    ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
                    : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  '&:hover': {
                    background: darkMode 
                      ? 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)' 
                      : 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
                  },
                  px: 3,
                  py: 1
                }}
              >
                Refresh
              </Button>
            </Stack>
          </Box>

          {/* Stats Overview */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {statsData.map((stat, index) => (
              <Grid key={index} item xs={12} sm={6} md={3}>
                <StatCard {...stat} darkMode={darkMode} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Main Content - This will grow to fill remaining space */}
        <Box sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0 // Important for scrolling
        }}>
          <Card sx={{ 
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            bgcolor: darkMode ? 'grey.900' : 'white',
            border: `1px solid ${darkMode ? 'grey.800' : 'grey.100'}`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            {/* Control Bar */}
            <Box sx={{ 
              p: 3, 
              borderBottom: `1px solid ${darkMode ? 'grey.800' : 'grey.100'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              flexShrink: 0
            }}>
              <Tabs 
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    minHeight: 48,
                    borderRadius: 2,
                    px: 2,
                    '&.Mui-selected': {
                      bgcolor: darkMode ? 'primary.dark' : 'primary.light',
                      color: 'white',
                      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                    }
                  }
                }}
              >
                <Tab label="All Bookings" />
                <Tab label={`Upcoming ${stats.upcoming ? `(${stats.upcoming})` : ''}`} />
                <Tab label="Completed" />
                <Tab label="Cancelled" />
              </Tabs>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  placeholder="Search bookings..."
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ minWidth: { xs: '100%', sm: 250 } }}
                  InputProps={{
                    startAdornment: <FilterAlt fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />

                <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="date_desc">Newest First</MenuItem>
                    <MenuItem value="date_asc">Oldest First</MenuItem>
                    <MenuItem value="price_desc">Price: High to Low</MenuItem>
                    <MenuItem value="price_asc">Price: Low to High</MenuItem>
                  </Select>
                </FormControl>

                <IconButton 
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  sx={{ 
                    border: `1px solid ${darkMode ? 'grey.700' : 'grey.200'}` 
                  }}
                >
                  {viewMode === 'grid' ? <ViewCarousel /> : <Menu />}
                </IconButton>
              </Box>
            </Box>

            {/* Bookings Content - This will scroll */}
            <Box sx={{ 
              p: 3, 
              flexGrow: 1, 
              overflow: 'auto',
              minHeight: 0 // Important for scrolling
            }}>
              {loading ? (
                <Grid container spacing={3}>
                  {[1, 2, 3].map((item) => (
                    <Grid key={item} item xs={12} sm={6} md={4}>
                      <Skeleton 
                        variant="rectangular" 
                        height={300} 
                        sx={{ 
                          borderRadius: 3,
                          bgcolor: darkMode ? 'grey.800' : 'grey.100'
                        }} 
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : filteredBookings.length === 0 ? (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  color: darkMode ? 'grey.400' : 'grey.600',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Box sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    bgcolor: darkMode ? 'grey.800' : 'grey.100',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3
                  }}>
                    <DirectionsCar sx={{ fontSize: 48, opacity: 0.5 }} />
                  </Box>
                  <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                    {bookings.length === 0 ? "No bookings found" : "No matching bookings"}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, maxWidth: 400 }}>
                    {bookings.length === 0 
                      ? "Start by booking your first premium vehicle" 
                      : "Try adjusting your search or filters"}
                  </Typography>
                  {bookings.length === 0 && (
                    <Button
                      variant="contained"
                      size="large"
                      href="/cars"
                      sx={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        px: 4,
                        py: 1.5,
                        borderRadius: 2
                      }}
                    >
                      Browse Premium Cars
                    </Button>
                  )}
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {filteredBookings.map((booking) => (
                    <Grid key={booking.id} item xs={12} sm={6} md={4} lg={3}>
                      <BookingCard
                        booking={booking}
                        darkMode={darkMode}
                        onViewDetails={(b) => setDetailsDrawer({ open: true, booking: b })}
                        onDownloadInvoice={handleDownloadInvoice}
                        onCancel={(b) => setCancelDialog({ open: true, booking: b })}
                        loadingDetails={loadingDetails}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Card>
        </Box>
      </Container>

      {/* Details Drawer */}
      <Dialog
        open={detailsDrawer.open}
        onClose={() => setDetailsDrawer({ open: false, booking: null })}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: darkMode ? 'grey.900' : 'white',
            backgroundImage: 'none'
          }
        }}
      >
        {detailsDrawer.booking && (
          <>
            <DialogTitle sx={{ 
              borderBottom: `1px solid ${darkMode ? 'grey.800' : 'grey.100'}`,
              pb: 2 
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Booking Details
                </Typography>
                <IconButton 
                  onClick={() => setDetailsDrawer({ open: false, booking: null })}
                  size="small"
                >
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            
            <DialogContent sx={{ pt: 3 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                    VEHICLE INFORMATION
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
                    {detailsDrawer.booking.carMake} {detailsDrawer.booking.carModel}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {detailsDrawer.booking.vehicleDescription}
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {[
                      { icon: <Speed />, label: 'Transmission', value: detailsDrawer.booking.features.transmission },
                      { icon: <LocalGasStation />, label: 'Fuel Type', value: detailsDrawer.booking.features.fuelType },
                      { icon: <People />, label: 'Seats', value: detailsDrawer.booking.features.seats },
                      { icon: <DirectionsCar />, label: 'Luggage', value: `${detailsDrawer.booking.features.luggage} bags` },
                    ].map((item, index) => (
                      <Grid key={index} item xs={6}>
                        <Box sx={{ 
                          p: 2, 
                          borderRadius: 2,
                          bgcolor: darkMode ? 'grey.800' : 'grey.50',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5
                        }}>
                          <Box sx={{ color: 'primary.main' }}>
                            {item.icon}
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              {item.label}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {item.value}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                
                <Divider />
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                    BOOKING TIMELINE
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: darkMode ? 'grey.800' : 'grey.50'
                    }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          CHECK-IN
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatDate(detailsDrawer.booking.checkInDate)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {detailsDrawer.booking.pickupTime}
                        </Typography>
                      </Box>
                      <ArrowForward sx={{ color: 'action.active', alignSelf: 'center' }} />
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          CHECK-OUT
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatDate(detailsDrawer.booking.checkOutDate)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {detailsDrawer.booking.dropoffTime}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: darkMode ? 'grey.800' : 'grey.50'
                    }}>
                      <Typography variant="body2">Booking ID</Typography>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 500, 
                        fontFamily: 'monospace',
                        color: 'primary.main'
                      }}>
                        {detailsDrawer.booking.bookingConfirmationCode}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
                
                <Divider />
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                    PAYMENT DETAILS
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: darkMode ? 'grey.800' : 'grey.50'
                    }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Total Amount
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                        ${detailsDrawer.booking.price}
                      </Typography>
                    </Box>
                    
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<Download />}
                        onClick={() => handleDownloadInvoice(detailsDrawer.booking.id)}
                        disabled={loadingDetails[detailsDrawer.booking.id]}
                      >
                        Download Invoice
                      </Button>
                      {detailsDrawer.booking.status === 'confirmed' && (
                        <Button
                          variant="outlined"
                          color="error"
                          fullWidth
                          startIcon={<Cancel />}
                          onClick={() => {
                            setDetailsDrawer({ open: false, booking: null });
                            setCancelDialog({ open: true, booking: detailsDrawer.booking });
                          }}
                        >
                          Cancel Booking
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog
        open={cancelDialog.open}
        onClose={() => setCancelDialog({ open: false, booking: null })}
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: darkMode ? 'grey.900' : 'white'
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Warning color="error" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Cancel Booking
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {cancelDialog.booking && (
            <Stack spacing={3}>
              <Typography>
                Are you sure you want to cancel your booking for the{' '}
                <strong>{cancelDialog.booking.carMake} {cancelDialog.booking.carModel}</strong>?
              </Typography>
              
              <Box sx={{ 
                p: 2, 
                borderRadius: 2,
                bgcolor: darkMode ? 'grey.800' : 'grey.50'
              }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                  CANCELLATION POLICY
                </Typography>
                <Typography variant="body2">
                  {cancelDialog.booking.cancellationPolicy}
                </Typography>
              </Box>
              
              {loadingDetails[cancelDialog.booking.id] && (
                <LinearProgress />
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setCancelDialog({ open: false, booking: null })}
            disabled={loadingDetails[cancelDialog.booking?.id]}
            sx={{ fontWeight: 600 }}
          >
            Keep Booking
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancelBooking}
            disabled={loadingDetails[cancelDialog.booking?.id]}
            startIcon={<Cancel />}
            sx={{ fontWeight: 600 }}
          >
            Confirm Cancellation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)',
            bgcolor: alpha(theme.palette[snackbar.severity].main, 0.95),
            fontWeight: 500
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Support FAB */}
      <Tooltip title="Contact Support">
        <Box sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000
        }}>
          <Button
            variant="contained"
            startIcon={<SupportAgent />}
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1.5,
              boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              '&:hover': {
                boxShadow: '0 12px 48px rgba(59, 130, 246, 0.4)',
              },
              fontWeight: 600
            }}
            href="/support"
          >
            Support
          </Button>
        </Box>
      </Tooltip>
    </Box>
  );
}