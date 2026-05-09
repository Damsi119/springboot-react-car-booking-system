import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import {
  Search,
  FilterList,
  Download,
  Print,
  Share,
  MoreVert,
  CalendarMonth,
  DirectionsCar,
  Person,
  Paid,
  Cancel,
  CheckCircle,
  PendingActions,
  AccessTime,
  ArrowForward,
  ArrowDownward,
  ArrowUpward,
  Visibility,
  Edit,
  Delete,
  Refresh,
  Star,
  Speed,
  LocalGasStation,
  People,
  Luggage,
  LocationOn,
  Phone,
  Email,
  Receipt,
  Chat,
  SupportAgent,
  TrendingUp,
  TrendingDown,
  WbSunny,
  NightsStay,
  ViewCarousel,
  Menu,
  Close,
  Info,
  Warning,
  Error as ErrorIcon,
  VerifiedUser,
  CarRental,
  Payment,
  ConfirmationNumber,
  EventAvailable,
  EventBusy,
  Schedule,
  BookOnline,
  History,
} from "@mui/icons-material";

import {
  Box,
  Container,
  Typography,
  IconButton,
  Button,
  Stack,
  Tooltip,
  Grid,
  Card,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Checkbox,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
  alpha
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const AllBookingsAdmin = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  // Source state only
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // UI state
  const [darkMode, setDarkMode] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState(0);
  
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Status colors and icons
  const statusConfig = useMemo(() => ({
    confirmed: { color: "#10b981", icon: <CheckCircle />, label: "Confirmed" },
    pending: { color: "#f59e0b", icon: <PendingActions />, label: "Pending" },
    cancelled: { color: "#ef4444", icon: <Cancel />, label: "Cancelled" },
    completed: { color: "#3b82f6", icon: <VerifiedUser />, label: "Completed" },
    in_progress: { color: "#8b5cf6", icon: <AccessTime />, label: "In Progress" },
  }), []);

  // Fetch all users (admin only)
  const fetchAllUsers = useCallback(async () => {
    if (!token || !user || user.role !== "ADMIN") {
      return;
    }

    setUsersLoading(true);
    try {
      const response = await axios.get("http://localhost:4040/users/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.statusCode === 200) {
        setUsers(response.data.data || response.data.userList || []);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setUsersLoading(false);
    }
  }, [token, user]);

  // Fetch all bookings
  const fetchAllBookings = useCallback(async () => {
    if (!token || !user || user.role !== "ADMIN") {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:4040/bookings/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.statusCode === 200) {
        const bookingsData = response.data.bookingList || response.data.data || [];
        
        // Process bookings with enhanced user info
        const processedBookings = bookingsData.map(booking => {
          // Find user details from users state if available
          const userDetails = users.find(u => u.id === booking.user?.id);
          
          return {
            id: booking.id,
            bookingCode: booking.bookingConfirmationCode || `BOOK-${booking.id}`,
            customer: {
              id: booking.user?.id,
              name: booking.user?.username || userDetails?.username || "Unknown",
              email: booking.user?.email || userDetails?.email,
              phone: booking.user?.phoneNumber || userDetails?.phoneNumber || userDetails?.phone,
              avatar: `https://ui-avatars.com/api/?name=${booking.user?.username || userDetails?.username || "Customer"}&background=FF6F61&color=fff`,
              address: userDetails?.address,
              city: userDetails?.city,
              country: userDetails?.country,
              zipCode: userDetails?.zipCode,
              driverLicense: userDetails?.driverLicense,
              licenseExpiry: userDetails?.licenseExpiry,
              dateOfBirth: userDetails?.dateOfBirth,
              registrationDate: userDetails?.createdAt,
              totalBookings: userDetails?.totalBookings,
              membershipLevel: userDetails?.membershipLevel || "Standard",
              isVerified: userDetails?.isVerified || false,
              status: userDetails?.status || "active",
            },
            vehicle: {
              id: booking.car?.id,
              make: booking.car?.make || "Unknown",
              model: booking.car?.model || "Unknown",
              type: booking.car?.type || "SUV",
              year: booking.car?.year,
              color: booking.car?.color,
              licensePlate: booking.car?.licensePlate,
              image: booking.car?.images?.[0] || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=400&fit=crop",
              category: booking.car?.vehicleCategory || "Premium",
              transmission: booking.car?.transmission || "Automatic",
              fuelType: booking.car?.fuelType || "Petrol",
              seats: booking.car?.seats || 5,
              luggage: booking.car?.luggage || 2,
            },
            dates: {
              checkIn: booking.checkInDate || booking.checkIn,
              checkOut: booking.checkOutDate || booking.checkOut,
              duration: booking.duration || 1,
            },
            pricing: {
              total: booking.totalAmount || booking.totalPrice || 0,
              dailyRate: booking.dailyRate || 0,
              deposit: booking.deposit || 0,
              insurance: booking.insurance || 0,
            },
            status: booking.status?.toLowerCase() || "pending",
            payment: {
              status: booking.paymentStatus || "pending",
              method: booking.paymentMethod || "Credit Card",
              transactionId: booking.transactionId,
            },
            createdAt: booking.createdAt || new Date().toISOString(),
            notes: booking.notes || "",
            pickupLocation: booking.pickupLocation || "Main Office",
            dropoffLocation: booking.dropoffLocation || "Main Office",
            extras: booking.extras || [],
            rating: booking.rating || null,
            feedback: booking.feedback || "",
          };
        });
        
        setBookings(processedBookings);
      } else {
        setError("Failed to fetch bookings");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [token, user, navigate, users]);

  // Fetch users when component mounts
  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Fetch bookings when users are loaded
  useEffect(() => {
    if (users.length > 0 || !usersLoading) {
      fetchAllBookings();
    }
  }, [users, usersLoading]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [searchQuery, statusFilter, dateFilter, sortBy, activeTab]);

  // Derived filtered bookings using useMemo (NO setState loop)
  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(booking =>
        booking.bookingCode.toLowerCase().includes(query) ||
        booking.customer.name.toLowerCase().includes(query) ||
        booking.customer.email.toLowerCase().includes(query) ||
        booking.customer.phone?.toLowerCase().includes(query) ||
        booking.vehicle.make.toLowerCase().includes(query) ||
        booking.vehicle.model.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(booking => booking.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      result = result.filter(booking => {
        const checkIn = new Date(booking.dates.checkIn);
        switch (dateFilter) {
          case "today":
            return checkIn.toDateString() === now.toDateString();
          case "upcoming":
            return checkIn > now;
          case "past":
            return checkIn < now;
          case "this_month":
            return checkIn.getMonth() === now.getMonth() && checkIn.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    // Tab filter
    switch (activeTab) {
      case 1: // Upcoming
        result = result.filter(booking => new Date(booking.dates.checkIn) > new Date());
        break;
      case 2: // In Progress
        result = result.filter(booking => booking.status === "in_progress");
        break;
      case 3: // Completed
        result = result.filter(booking => booking.status === "completed");
        break;
      case 4: // Cancelled
        result = result.filter(booking => booking.status === "cancelled");
        break;
    }

    // Sort
    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "date_desc":
          return new Date(b.dates.checkIn) - new Date(a.dates.checkIn);
        case "date_asc":
          return new Date(a.dates.checkIn) - new Date(b.dates.checkIn);
        case "price_desc":
          return b.pricing.total - a.pricing.total;
        case "price_asc":
          return a.pricing.total - b.pricing.total;
        case "name_asc":
          return a.customer.name.localeCompare(b.customer.name);
        case "name_desc":
          return b.customer.name.localeCompare(a.customer.name);
        default:
          return 0;
      }
    });
  }, [bookings, searchQuery, statusFilter, dateFilter, sortBy, activeTab]);

  // Format date helper
  const formatDate = useCallback((dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "Invalid Date";
    }
  }, []);

  // Format currency helper
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }, []);

  // Handle row selection
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredBookings.map((n) => n.id);
      setSelectedBookings(newSelected);
      return;
    }
    setSelectedBookings([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selectedBookings.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedBookings, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedBookings.slice(1));
    } else if (selectedIndex === selectedBookings.length - 1) {
      newSelected = newSelected.concat(selectedBookings.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedBookings.slice(0, selectedIndex),
        selectedBookings.slice(selectedIndex + 1),
      );
    }

    setSelectedBookings(newSelected);
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Export to Excel
  const handleExportExcel = () => {
    const exportData = filteredBookings.map(booking => ({
      'Booking Code': booking.bookingCode,
      'Customer Name': booking.customer.name,
      'Customer Email': booking.customer.email,
      'Customer Phone': booking.customer.phone || 'N/A',
      'Customer Address': `${booking.customer.address || ''} ${booking.customer.city || ''} ${booking.customer.country || ''}`,
      'Vehicle': `${booking.vehicle.make} ${booking.vehicle.model}`,
      'Check-in Date': formatDate(booking.dates.checkIn),
      'Check-out Date': formatDate(booking.dates.checkOut),
      'Duration (days)': booking.dates.duration,
      'Total Amount': booking.pricing.total,
      'Status': statusConfig[booking.status]?.label || booking.status,
      'Payment Status': booking.payment.status,
      'Payment Method': booking.payment.method,
      'Created At': formatDate(booking.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `bookings_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    setSuccess("Bookings exported successfully!");
  };

  // Handle booking actions
  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:4040/bookings/update-status/${bookingId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.statusCode === 200) {
        setSuccess(`Booking status updated to ${newStatus}`);
        fetchAllBookings();
      }
    } catch (err) {
      setError("Failed to update booking status");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      const response = await axios.delete(
        `http://localhost:4040/bookings/delete/${bookingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.statusCode === 200) {
        setSuccess("Booking deleted successfully");
        fetchAllBookings();
        setDeleteDialogOpen(false);
      }
    } catch (err) {
      setError("Failed to delete booking");
    }
  };

  // Statistics using useMemo (derived from source)
  const stats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    const revenue = bookings.reduce((sum, b) => sum + b.pricing.total, 0);
    const avgBookingValue = total > 0 ? revenue / total : 0;

    return {
      total,
      confirmed,
      pending,
      completed,
      cancelled,
      revenue,
      avgBookingValue,
    };
  }, [bookings]);

  const statusStats = useMemo(() => [
    { label: 'Total Bookings', value: stats.total, color: '#3b82f6', icon: <BookOnline /> },
    { label: 'Confirmed', value: stats.confirmed, color: '#10b981', icon: <CheckCircle /> },
    { label: 'Pending', value: stats.pending, color: '#f59e0b', icon: <PendingActions /> },
    { label: 'Revenue', value: formatCurrency(stats.revenue), color: '#8b5cf6', icon: <Paid /> },
  ], [stats, formatCurrency]);

  // Tabs using useMemo
  const tabs = useMemo(() => [
    { label: 'All Bookings', count: stats.total },
    { label: 'Upcoming', count: bookings.filter(b => new Date(b.dates.checkIn) > new Date()).length },
    { label: 'In Progress', count: bookings.filter(b => b.status === 'in_progress').length },
    { label: 'Completed', count: stats.completed },
    { label: 'Cancelled', count: stats.cancelled },
  ], [stats, bookings]);

  // Paginated bookings for display
  const paginatedBookings = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredBookings.slice(startIndex, endIndex);
  }, [filteredBookings, page, rowsPerPage]);

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: darkMode ? 'grey.950' : 'grey.50',
      transition: 'background-color 0.3s ease',
      py: 3,
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', md: 'center' },
            mb: 3,
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3
          }}>
            <Box>
              <Typography variant="h3" sx={{ 
                fontWeight: 900,
                background: darkMode 
                  ? 'linear-gradient(135deg, #FF6F61 0%, #E55450 100%)' 
                  : 'linear-gradient(135deg, #FF6F61 0%, #E55450 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
                fontSize: { xs: '2rem', md: '2.75rem' }
              }}>
                Booking Management
              </Typography>
              <Typography variant="h6" sx={{ 
                color: darkMode ? 'grey.400' : 'grey.600',
                fontWeight: 400,
                fontSize: { xs: '1rem', md: '1.25rem' }
              }}>
                Manage and monitor all bookings in the system
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
                  {darkMode ? <WbSunny /> : <NightsStay />}
                </IconButton>
              </Tooltip>
              
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={fetchAllBookings}
                sx={{
                  background: 'linear-gradient(135deg, #FF6F61 0%, #E55450 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #E55450 0%, #FF6F61 100%)',
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
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {statusStats.map((stat, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card sx={{ 
                    borderRadius: 3,
                    bgcolor: darkMode ? 'grey.900' : 'white',
                    border: `1px solid ${darkMode ? 'grey.800' : 'grey.100'}`,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' }
                  }}>
                    <Box sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ 
                          p: 1.5, 
                          borderRadius: 2,
                          bgcolor: alpha(stat.color, 0.1),
                          color: stat.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {stat.icon}
                        </Box>
                        <Chip
                          label={index === 3 ? "+18%" : "+12%"}
                          size="small"
                          color="success"
                          variant="outlined"
                          icon={<TrendingUp sx={{ fontSize: 14 }} />}
                        />
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, fontSize: { xs: '1.75rem', md: '2rem' } }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: darkMode ? 'grey.400' : 'grey.600',
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Main Content */}
        <Card sx={{ 
          mb: 4,
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
            gap: 2
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
                    bgcolor: darkMode ? alpha('#FF6F61', 0.2) : alpha('#FF6F61', 0.1),
                    color: '#FF6F61',
                    boxShadow: '0 2px 8px rgba(255, 111, 97, 0.3)'
                  }
                }
              }}
            >
              {tabs.map((tab, index) => (
                <Tab 
                  key={index}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {tab.label}
                      {tab.count > 0 && (
                        <Chip 
                          label={tab.count} 
                          size="small" 
                          sx={{ 
                            height: 20, 
                            fontSize: '0.7rem',
                            bgcolor: darkMode ? alpha('#FF6F61', 0.2) : alpha('#FF6F61', 0.1),
                            color: '#FF6F61'
                          }} 
                        />
                      )}
                    </Box>
                  } 
                />
              ))}
            </Tabs>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search bookings, customers, phone..."
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ minWidth: { xs: '100%', sm: 250 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" sx={{ color: 'action.active' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
                <Select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Dates</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="past">Past</MenuItem>
                  <MenuItem value="this_month">This Month</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="date_desc">Newest First</MenuItem>
                  <MenuItem value="date_asc">Oldest First</MenuItem>
                  <MenuItem value="price_desc">Price: High to Low</MenuItem>
                  <MenuItem value="price_asc">Price: Low to High</MenuItem>
                  <MenuItem value="name_asc">Name: A-Z</MenuItem>
                  <MenuItem value="name_desc">Name: Z-A</MenuItem>
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

              {selectedBookings.length > 0 && (
                <Chip
                  label={`${selectedBookings.length} selected`}
                  onDelete={() => setSelectedBookings([])}
                  deleteIcon={<Close />}
                  sx={{ fontWeight: 600 }}
                />
              )}
            </Box>
          </Box>

          {/* Bulk Actions Bar */}
          {selectedBookings.length > 0 && (
            <Fade in>
              <Box sx={{ 
                p: 2, 
                bgcolor: darkMode ? alpha('#FF6F61', 0.1) : alpha('#FF6F61', 0.05),
                borderBottom: `1px solid ${darkMode ? 'grey.800' : 'grey.100'}`,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap'
              }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {selectedBookings.length} booking(s) selected
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleExportExcel}
                >
                  Export Selected
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Print />}
                >
                  Print
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Cancel />}
                  color="error"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete
                </Button>
              </Box>
            </Fade>
          )}

          {/* Bookings Content */}
          <Box sx={{ p: 3 }}>
            {loading ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <CircularProgress size={60} sx={{ color: '#FF6F61', mb: 3 }} />
                <Typography variant="h6" sx={{ color: darkMode ? 'grey.400' : 'grey.600' }}>
                  Loading bookings...
                </Typography>
              </Box>
            ) : error ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <ErrorIcon sx={{ fontSize: 60, color: '#ef4444', mb: 3 }} />
                <Typography variant="h6" sx={{ color: darkMode ? 'grey.400' : 'grey.600', mb: 2 }}>
                  {error}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={fetchAllBookings}
                  sx={{
                    background: 'linear-gradient(135deg, #FF6F61 0%, #E55450 100%)',
                  }}
                >
                  Try Again
                </Button>
              </Box>
            ) : filteredBookings.length === 0 ? (
              <Box sx={{ 
                textAlign: 'center', 
                py: 8,
                color: darkMode ? 'grey.400' : 'grey.600'
              }}>
                <Box sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  bgcolor: darkMode ? 'grey.800' : 'grey.100',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}>
                  <CalendarMonth sx={{ fontSize: 48, opacity: 0.5 }} />
                </Box>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                  No bookings found
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                  {searchQuery 
                    ? "Try adjusting your search or filters" 
                    : "There are no bookings matching your criteria"
                  }
                </Typography>
              </Box>
            ) : viewMode === 'grid' ? (
              // Grid View
              <Grid container spacing={3}>
                {paginatedBookings.map((booking) => (
                  <Grid key={booking.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card sx={{
                        borderRadius: 3,
                        bgcolor: darkMode ? 'grey.900' : 'white',
                        border: `1px solid ${darkMode ? 'grey.800' : 'grey.100'}`,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 8px 32px rgba(255, 111, 97, 0.15)',
                          transform: 'translateY(-2px)'
                        },
                        overflow: 'hidden'
                      }}>
                        {/* Booking Header */}
                        <Box sx={{ 
                          p: 2, 
                          bgcolor: darkMode ? 'grey.800' : 'grey.50',
                          borderBottom: `1px solid ${darkMode ? 'grey.700' : 'grey.200'}`,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <Typography variant="subtitle2" sx={{ 
                            fontWeight: 700,
                            fontFamily: 'monospace',
                            color: '#FF6F61'
                          }}>
                            {booking.bookingCode}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Checkbox
                              size="small"
                              checked={selectedBookings.indexOf(booking.id) !== -1}
                              onChange={(event) => handleClick(event, booking.id)}
                              sx={{ p: 0 }}
                            />
                            <Chip
                              label={statusConfig[booking.status]?.label || booking.status}
                              size="small"
                              icon={statusConfig[booking.status]?.icon}
                              sx={{
                                bgcolor: alpha(statusConfig[booking.status]?.color || '#666', 0.1),
                                color: statusConfig[booking.status]?.color || '#666',
                                fontWeight: 600,
                                fontSize: '0.7rem',
                              }}
                            />
                          </Box>
                        </Box>

                        {/* Booking Content */}
                        <Box sx={{ p: 3 }}>
                          {/* Customer Info */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Avatar 
                              src={booking.customer.avatar} 
                              sx={{ width: 50, height: 50 }}
                            />
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                {booking.customer.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: darkMode ? 'grey.400' : 'grey.600' }}>
                                {booking.customer.email}
                              </Typography>
                              {booking.customer.phone && (
                                <Typography variant="caption" sx={{ 
                                  color: darkMode ? 'grey.400' : 'grey.600', 
                                  display: 'block',
                                  mt: 0.5 
                                }}>
                                  📱 {booking.customer.phone}
                                </Typography>
                              )}
                            </Box>
                          </Box>

                          {/* Vehicle Info */}
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" sx={{ 
                              color: darkMode ? 'grey.400' : 'grey.600',
                              mb: 1,
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: 1,
                              fontSize: '0.75rem'
                            }}>
                              VEHICLE
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                              {booking.vehicle.make} {booking.vehicle.model}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                              <Chip size="small" icon={<Speed />} label={booking.vehicle.transmission} />
                              <Chip size="small" icon={<LocalGasStation />} label={booking.vehicle.fuelType} />
                              <Chip size="small" icon={<People />} label={`${booking.vehicle.seats} seats`} />
                            </Box>
                          </Box>

                          {/* Dates */}
                          <Box sx={{ 
                            p: 2, 
                            borderRadius: 2,
                            bgcolor: darkMode ? 'grey.800' : 'grey.50',
                            mb: 3
                          }}>
                            <Grid container spacing={2}>
                              <Grid size={{ xs: 6 }}>
                                <Typography variant="caption" sx={{ 
                                  color: darkMode ? 'grey.400' : 'grey.600',
                                  display: 'block',
                                  mb: 0.5
                                }}>
                                  CHECK-IN
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {formatDate(booking.dates.checkIn)}
                                </Typography>
                              </Grid>
                              <Grid size={{ xs: 6 }}>
                                <Typography variant="caption" sx={{ 
                                  color: darkMode ? 'grey.400' : 'grey.600',
                                  display: 'block',
                                  mb: 0.5
                                }}>
                                  CHECK-OUT
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {formatDate(booking.dates.checkOut)}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>

                          {/* Price */}
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 3
                          }}>
                            <Box>
                              <Typography variant="caption" sx={{ 
                                color: darkMode ? 'grey.400' : 'grey.600',
                                display: 'block'
                              }}>
                                TOTAL AMOUNT
                              </Typography>
                              <Typography variant="h5" sx={{ 
                                fontWeight: 900,
                                color: '#FF6F61'
                              }}>
                                {formatCurrency(booking.pricing.total)}
                              </Typography>
                            </Box>
                            <Chip
                              label={booking.payment.status.toUpperCase()}
                              size="small"
                              sx={{
                                bgcolor: booking.payment.status === 'paid' 
                                  ? alpha('#10b981', 0.1) 
                                  : alpha('#f59e0b', 0.1),
                                color: booking.payment.status === 'paid' ? '#10b981' : '#f59e0b',
                                fontWeight: 600,
                              }}
                            />
                          </Box>

                          {/* Actions */}
                          <Stack direction="row" spacing={1}>
                            <Button
                              fullWidth
                              variant="outlined"
                              size="small"
                              startIcon={<Visibility />}
                              onClick={() => {
                                setSelectedBooking(booking);
                                setDetailsOpen(true);
                              }}
                            >
                              View Details
                            </Button>
                            <IconButton
                              size="small"
                              sx={{ border: `1px solid ${darkMode ? 'grey.700' : 'grey.200'}` }}
                              onClick={(e) => {
                                setSelectedBooking(booking);
                                setActionDialogOpen(true);
                              }}
                            >
                              <MoreVert />
                            </IconButton>
                          </Stack>
                        </Box>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            ) : (
              // Table View
              <Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            indeterminate={selectedBookings.length > 0 && selectedBookings.length < filteredBookings.length}
                            checked={filteredBookings.length > 0 && selectedBookings.length === filteredBookings.length}
                            onChange={handleSelectAllClick}
                          />
                        </TableCell>
                        <TableCell>
                          <TableSortLabel>
                            Booking Code
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Vehicle</TableCell>
                        <TableCell>Dates</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Payment</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedBookings.map((booking) => {
                        const isSelected = selectedBookings.indexOf(booking.id) !== -1;
                        return (
                          <TableRow
                            key={booking.id}
                            hover
                            selected={isSelected}
                            sx={{ '&:hover': { bgcolor: darkMode ? alpha('#FF6F61', 0.05) : alpha('#FF6F61', 0.02) } }}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isSelected}
                                onChange={(event) => handleClick(event, booking.id)}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                                {booking.bookingCode}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar src={booking.customer.avatar} sx={{ width: 32, height: 32 }} />
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {booking.customer.name}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: darkMode ? 'grey.400' : 'grey.600' }}>
                                    {booking.customer.email}
                                  </Typography>
                                  {booking.customer.phone && (
                                    <Typography variant="caption" sx={{ 
                                      color: darkMode ? 'grey.400' : 'grey.600',
                                      display: 'block'
                                    }}>
                                      📱 {booking.customer.phone}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {booking.vehicle.make} {booking.vehicle.model}
                              </Typography>
                              <Typography variant="caption" sx={{ color: darkMode ? 'grey.400' : 'grey.600' }}>
                                {booking.vehicle.category}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {formatDate(booking.dates.checkIn)}
                              </Typography>
                              <Typography variant="caption" sx={{ color: darkMode ? 'grey.400' : 'grey.600' }}>
                                {booking.dates.duration} days
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: '#FF6F61' }}>
                                {formatCurrency(booking.pricing.total)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={statusConfig[booking.status]?.label || booking.status}
                                size="small"
                                icon={statusConfig[booking.status]?.icon}
                                sx={{
                                  bgcolor: alpha(statusConfig[booking.status]?.color || '#666', 0.1),
                                  color: statusConfig[booking.status]?.color || '#666',
                                  fontWeight: 600,
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={booking.payment.status}
                                size="small"
                                sx={{
                                  bgcolor: booking.payment.status === 'paid' 
                                    ? alpha('#10b981', 0.1) 
                                    : alpha('#f59e0b', 0.1),
                                  color: booking.payment.status === 'paid' ? '#10b981' : '#f59e0b',
                                  fontWeight: 600,
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={1}>
                                <Tooltip title="View Details">
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setSelectedBooking(booking);
                                      setDetailsOpen(true);
                                    }}
                                  >
                                    <Visibility fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Actions">
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      setSelectedBooking(booking);
                                      setActionDialogOpen(true);
                                    }}
                                  >
                                    <MoreVert fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={filteredBookings.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Box>
            )}
          </Box>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 4 }}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportExcel}
            sx={{ fontWeight: 600 }}
          >
            Export to Excel
          </Button>
          <Button
            variant="outlined"
            startIcon={<Print />}
            sx={{ fontWeight: 600 }}
          >
            Print Report
          </Button>
          <Button
            variant="contained"
            startIcon={<SupportAgent />}
            sx={{
              background: 'linear-gradient(135deg, #FF6F61 0%, #E55450 100%)',
              fontWeight: 600,
            }}
          >
            Support Center
          </Button>
        </Box>
      </Container>

      {/* Booking Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: darkMode ? 'grey.900' : 'white',
            backgroundImage: 'none'
          }
        }}
      >
        {selectedBooking && (
          <>
            <DialogTitle sx={{ 
              borderBottom: `1px solid ${darkMode ? 'grey.800' : 'grey.100'}`,
              pb: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Booking Details
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={selectedBooking.bookingCode}
                  size="small"
                  sx={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    bgcolor: alpha('#FF6F61', 0.1),
                    color: '#FF6F61'
                  }}
                />
                <IconButton size="small" onClick={() => setDetailsOpen(false)}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={3}>
                {/* Left Column */}
                <Grid size={{ xs: 12, md: 6 }}>
                  {/* Enhanced Customer Details */}
                  <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ 
                      mb: 2,
                      color: darkMode ? 'grey.400' : 'grey.600',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      fontSize: '0.75rem'
                    }}>
                      CUSTOMER INFORMATION
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                      <Avatar src={selectedBooking.customer.avatar} sx={{ width: 80, height: 80 }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                          {selectedBooking.customer.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: darkMode ? 'grey.400' : 'grey.600', mb: 1 }}>
                          Customer ID: {selectedBooking.customer.id}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip 
                            label={selectedBooking.customer.membershipLevel} 
                            size="small" 
                            color="primary"
                            variant="outlined"
                          />
                          {selectedBooking.customer.isVerified && (
                            <Chip 
                              label="Verified" 
                              size="small" 
                              color="success"
                              icon={<VerifiedUser fontSize="small" />}
                            />
                          )}
                          <Chip 
                            label={selectedBooking.customer.status} 
                            size="small" 
                            color={selectedBooking.customer.status === 'active' ? 'success' : 'warning'}
                          />
                        </Box>
                      </Box>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: 2,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: darkMode ? 'grey.800' : 'grey.50'
                        }}>
                          <Email sx={{ color: '#FF6F61' }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" sx={{ color: darkMode ? 'grey.400' : 'grey.600' }}>
                              Email Address
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {selectedBooking.customer.email}
                            </Typography>
                          </Box>
                          <Button 
                            size="small" 
                            variant="outlined"
                            startIcon={<Email />}
                            onClick={() => window.location.href = `mailto:${selectedBooking.customer.email}`}
                          >
                            Email
                          </Button>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: 2,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: darkMode ? 'grey.800' : 'grey.50'
                        }}>
                          <Phone sx={{ color: '#FF6F61' }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" sx={{ color: darkMode ? 'grey.400' : 'grey.600' }}>
                              Phone Number
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {selectedBooking.customer.phone || 'Not provided'}
                            </Typography>
                          </Box>
                          {selectedBooking.customer.phone && (
                            <Button 
                              size="small" 
                              variant="outlined"
                              startIcon={<Phone />}
                              onClick={() => window.location.href = `tel:${selectedBooking.customer.phone}`}
                            >
                              Call
                            </Button>
                          )}
                        </Box>
                      </Grid>
                      {selectedBooking.customer.address && (
                        <Grid size={{ xs: 12 }}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: 2,
                            p: 2,
                            borderRadius: 2,
                            bgcolor: darkMode ? 'grey.800' : 'grey.50'
                          }}>
                            <LocationOn sx={{ color: '#FF6F61' }} />
                            <Box>
                              <Typography variant="caption" sx={{ color: darkMode ? 'grey.400' : 'grey.600' }}>
                                Address
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {selectedBooking.customer.address}
                                {selectedBooking.customer.city && `, ${selectedBooking.customer.city}`}
                                {selectedBooking.customer.country && `, ${selectedBooking.customer.country}`}
                                {selectedBooking.customer.zipCode && ` ${selectedBooking.customer.zipCode}`}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      )}
                      {selectedBooking.customer.driverLicense && (
                        <Grid size={{ xs: 12 }}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: 2,
                            p: 2,
                            borderRadius: 2,
                            bgcolor: darkMode ? 'grey.800' : 'grey.50'
                          }}>
                            <VerifiedUser sx={{ color: '#FF6F61' }} />
                            <Box>
                              <Typography variant="caption" sx={{ color: darkMode ? 'grey.400' : 'grey.600' }}>
                                Driver's License
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {selectedBooking.customer.driverLicense}
                                {selectedBooking.customer.licenseExpiry && ` (Expires: ${formatDate(selectedBooking.customer.licenseExpiry)})`}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      )}
                      {selectedBooking.customer.dateOfBirth && (
                        <Grid size={{ xs: 12 }}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: 2,
                            p: 2,
                            borderRadius: 2,
                            bgcolor: darkMode ? 'grey.800' : 'grey.50'
                          }}>
                            <CalendarMonth sx={{ color: '#FF6F61' }} />
                            <Box>
                              <Typography variant="caption" sx={{ color: darkMode ? 'grey.400' : 'grey.600' }}>
                                Date of Birth
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {formatDate(selectedBooking.customer.dateOfBirth)}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      )}
                      {selectedBooking.customer.registrationDate && (
                        <Grid size={{ xs: 12 }}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: 2,
                            p: 2,
                            borderRadius: 2,
                            bgcolor: darkMode ? 'grey.800' : 'grey.50'
                          }}>
                            <Person sx={{ color: '#FF6F61' }} />
                            <Box>
                              <Typography variant="caption" sx={{ color: darkMode ? 'grey.400' : 'grey.600' }}>
                                Member Since
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {formatDate(selectedBooking.customer.registrationDate)}
                              </Typography>
                              {selectedBooking.customer.totalBookings && (
                                <Typography variant="caption" sx={{ color: darkMode ? 'grey.400' : 'grey.600', display: 'block', mt: 0.5 }}>
                                  Total Bookings: {selectedBooking.customer.totalBookings}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Card>

                  {/* Vehicle Details */}
                  <Card sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ 
                      mb: 2,
                      color: darkMode ? 'grey.400' : 'grey.600',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      fontSize: '0.75rem'
                    }}>
                      VEHICLE INFORMATION
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                        {selectedBooking.vehicle.make} {selectedBooking.vehicle.model}
                      </Typography>
                      <Chip label={selectedBooking.vehicle.category} size="small" sx={{ mb: 2 }} />
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                        <Chip size="small" icon={<Speed />} label={selectedBooking.vehicle.transmission} />
                        <Chip size="small" icon={<LocalGasStation />} label={selectedBooking.vehicle.fuelType} />
                        <Chip size="small" icon={<People />} label={`${selectedBooking.vehicle.seats} seats`} />
                        <Chip size="small" icon={<Luggage />} label={`${selectedBooking.vehicle.luggage} bags`} />
                      </Box>
                    </Box>
                  </Card>
                </Grid>

                {/* Right Column */}
                <Grid size={{ xs: 12, md: 6 }}>
                  {/* Booking Timeline */}
                  <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ 
                      mb: 2,
                      color: darkMode ? 'grey.400' : 'grey.600',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      fontSize: '0.75rem'
                    }}>
                      BOOKING TIMELINE
                    </Typography>
                    <Stack spacing={3}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: darkMode ? 'grey.800' : 'grey.50'
                      }}>
                        <Box>
                          <Typography variant="caption" sx={{ 
                            color: darkMode ? 'grey.400' : 'grey.600',
                            display: 'block',
                            mb: 0.5
                          }}>
                            CHECK-IN
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatDate(selectedBooking.dates.checkIn)}
                          </Typography>
                        </Box>
                        <ArrowForward sx={{ color: 'action.active', alignSelf: 'center' }} />
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" sx={{ 
                            color: darkMode ? 'grey.400' : 'grey.600',
                            display: 'block',
                            mb: 0.5
                          }}>
                            CHECK-OUT
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatDate(selectedBooking.dates.checkOut)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box>
                        <Typography variant="caption" sx={{ 
                          color: darkMode ? 'grey.400' : 'grey.600',
                          display: 'block',
                          mb: 1
                        }}>
                          DURATION
                        </Typography>
                        <Typography variant="h5" sx={{ 
                          fontWeight: 800,
                          color: '#FF6F61'
                        }}>
                          {selectedBooking.dates.duration} days
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>

                  {/* Payment Details */}
                  <Card sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ 
                      mb: 2,
                      color: darkMode ? 'grey.400' : 'grey.600',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      fontSize: '0.75rem'
                    }}>
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
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#FF6F61' }}>
                          {formatCurrency(selectedBooking.pricing.total)}
                        </Typography>
                      </Box>
                      
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                          <Box sx={{ 
                            p: 2,
                            borderRadius: 2,
                            bgcolor: darkMode ? 'grey.800' : 'grey.50',
                            textAlign: 'center'
                          }}>
                            <Typography variant="caption" sx={{ 
                              color: darkMode ? 'grey.400' : 'grey.600',
                              display: 'block'
                            }}>
                              Daily Rate
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                              {formatCurrency(selectedBooking.pricing.dailyRate)}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <Box sx={{ 
                            p: 2,
                            borderRadius: 2,
                            bgcolor: darkMode ? 'grey.800' : 'grey.50',
                            textAlign: 'center'
                          }}>
                            <Typography variant="caption" sx={{ 
                              color: darkMode ? 'grey.400' : 'grey.600',
                              display: 'block'
                            }}>
                              Insurance
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                              {formatCurrency(selectedBooking.pricing.insurance)}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: darkMode ? 'grey.800' : 'grey.50'
                      }}>
                        <Typography variant="body2">
                          Payment Method
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {selectedBooking.payment.method}
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            
            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button
                variant="outlined"
                startIcon={<Receipt />}
              >
                Generate Invoice
              </Button>
              <Button
                variant="contained"
                startIcon={<Chat />}
                sx={{
                  background: 'linear-gradient(135deg, #FF6F61 0%, #E55450 100%)',
                }}
                onClick={() => {
                  setDetailsOpen(false);
                  // Navigate to chat with customer
                }}
              >
                Contact Customer
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Action Dialog */}
      <Dialog
        open={actionDialogOpen}
        onClose={() => setActionDialogOpen(false)}
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: darkMode ? 'grey.900' : 'white'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Booking Actions
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Stack spacing={2} sx={{ pt: 2 }}>
              <Typography variant="body2" sx={{ color: darkMode ? 'grey.400' : 'grey.600' }}>
                Select an action for booking{' '}
                <strong>{selectedBooking.bookingCode}</strong>
              </Typography>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Edit />}
              >
                Edit Booking
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<CheckCircle />}
                onClick={() => {
                  handleUpdateStatus(selectedBooking.id, 'confirmed');
                  setActionDialogOpen(false);
                }}
              >
                Confirm Booking
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Cancel />}
                color="error"
                onClick={() => {
                  handleUpdateStatus(selectedBooking.id, 'cancelled');
                  setActionDialogOpen(false);
                }}
              >
                Cancel Booking
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Receipt />}
              >
                Generate Invoice
              </Button>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setActionDialogOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: darkMode ? 'grey.900' : 'white'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Warning color="error" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Confirm Deletion
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 3 }}>
            Are you sure you want to delete {selectedBookings.length} selected booking(s)?
            This action cannot be undone.
          </Typography>
          {selectedBooking && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              This will permanently remove booking {selectedBooking.bookingCode}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              selectedBookings.forEach(id => handleDeleteBooking(id));
              setDeleteDialogOpen(false);
              setSelectedBookings([]);
            }}
            sx={{ fontWeight: 600 }}
          >
            Delete Selected
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Zoom}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSuccess("")}
          sx={{
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)',
            bgcolor: alpha(theme.palette.success.main, 0.95),
            fontWeight: 500
          }}
        >
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Zoom}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setError("")}
          sx={{
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)',
            bgcolor: alpha(theme.palette.error.main, 0.95),
            fontWeight: 500
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AllBookingsAdmin;