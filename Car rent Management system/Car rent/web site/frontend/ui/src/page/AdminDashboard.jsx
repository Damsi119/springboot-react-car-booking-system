import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Card,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Button,
  IconButton,
  Chip,
  LinearProgress,
  useTheme,
  useMediaQuery,
  alpha,
  Badge,
  Tooltip,
  Stack,
  Menu,
  MenuItem,
  Fade,
  Zoom,
  Skeleton,
  Container,
  Grid,
} from "@mui/material";
import {
  DirectionsCar,
  People,
  BookOnline,
  MonetizationOn,
  Dashboard,
  Logout,
  Person,
  Menu as MenuIcon,
  Notifications,
  Settings,
  TrendingUp,
  TrendingDown,
  Star,
  Security,
  CalendarToday,
  LocationOn,
  Speed,
  LocalGasStation,
  ColorLens,
  WbSunny,
  NightsStay,
  Refresh,
  Download,
  FilterList,
  MoreVert,
  ArrowForward,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Info,
  BarChart,
  PieChart,
  ShowChart,
  Timeline,
  AttachMoney,
  CarRental,
  VerifiedUser,
  AccountCircle,
  AdminPanelSettings,
  ExitToApp,
  Home,
  Inventory,
  Receipt,
  SupportAgent,
  Analytics,
  Description,
  Email,
  Phone,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import CountUp from "react-countup";

export default function AdminDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [totalCars, setTotalCars] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  
  const [monthlyBookings, setMonthlyBookings] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [carCategoryDistribution, setCarCategoryDistribution] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [topCars, setTopCars] = useState([]);

  const COLORS = ["#FF6F61", "#6C63FF", "#FFB400", "#00C49F", "#8A2BE2", "#FF69B4", "#36D1DC", "#5B86E5"];
  const drawerWidth = 280;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "ADMIN") {
      navigate("/login");
    } else {
      setUser(storedUser);
      fetchStats();
    }
  }, [navigate]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [carRes, userRes, bookingRes] = await Promise.all([
        axios.get("http://localhost:4040/cars/all", config),
        axios.get("http://localhost:4040/users/all", config),
        axios.get("http://localhost:4040/bookings/all", config),
      ]);

      const cars = carRes.data.carList || [];
      const users = userRes.data.userList || [];
      const bookings = bookingRes.data.bookingList || [];

      // Process data
      setTotalCars(cars.length);
      setTotalCustomers(users.length);
      setTotalBookings(bookings.length);
      
      const revenue = bookings.reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);
      setTotalRevenue(revenue);

      // Category distribution
      const categoryMap = {};
      cars.forEach((c) => {
        const cat = c.vehicleCategory || "Unknown";
        categoryMap[cat] = (categoryMap[cat] || 0) + 1;
      });
      setCarCategoryDistribution(
        Object.keys(categoryMap).map((k) => ({ name: k, value: categoryMap[k], fill: COLORS[Object.keys(categoryMap).indexOf(k) % COLORS.length] }))
      );

      // Monthly data
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const bookingMap = {};
      const revenueMap = {};

      bookings.forEach((b) => {
        const date = b.checkInDate || b.checkIn;
        if (!date) return;
        const m = new Date(date).getMonth();
        bookingMap[m] = (bookingMap[m] || 0) + 1;
        revenueMap[m] = (revenueMap[m] || 0) + Number(b.totalAmount || 0);
      });

      setMonthlyBookings(months.map((m, i) => ({ 
        month: m, 
        bookings: bookingMap[i] || 0,
        target: 50 // Example target
      })));
      
      setMonthlyRevenue(months.map((m, i) => ({ 
        month: m, 
        revenue: revenueMap[i] || 0,
        growth: i > 0 ? ((revenueMap[i] || 0) - (revenueMap[i-1] || 0)) / (revenueMap[i-1] || 1) * 100 : 0
      })));

      // Recent bookings
      setRecentBookings(bookings.slice(0, 5).map(b => ({
        id: b.id,
        customer: b.user?.username || "Unknown",
        car: b.car?.model || "Unknown",
        date: b.checkInDate || "N/A",
        amount: b.totalAmount || 0,
        status: b.status || "pending"
      })));

      // Top cars (mock data - you'd need actual booking counts)
      setTopCars(cars.slice(0, 5).map(c => ({
        name: c.model,
        bookings: Math.floor(Math.random() * 20) + 5,
        revenue: Math.floor(Math.random() * 5000) + 1000,
        rating: (Math.random() * 2 + 3).toFixed(1)
      })));

    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const stats = [
    { 
      title: "Total Cars", 
      value: totalCars, 
      icon: <DirectionsCar />, 
      color: "#FF6F61",
      change: "+12%",
      trend: "up"
    },
    { 
      title: "Customers", 
      value: totalCustomers, 
      icon: <People />, 
      color: "#6C63FF",
      change: "+8%",
      trend: "up"
    },
    { 
      title: "Bookings", 
      value: totalBookings, 
      icon: <BookOnline />, 
      color: "#FFB400",
      change: "+15%",
      trend: "up"
    },
    { 
      title: "Revenue ($)", 
      value: totalRevenue, 
      icon: <MonetizationOn />, 
      color: "#00C49F",
      change: "+23%",
      trend: "up"
    },
  ];

  const menuItems = [
    { icon: <Dashboard />, text: "Dashboard", path: "" },
    { icon: <DirectionsCar />, text: "Cars", path: "/vehicle" },
    { icon: <People />, text: "Users", path: "/userManagement" },
    { icon: <Inventory />, text: "Bookings", path: "/allBookingsAdmin" },
    { icon: <Receipt />, text: "Invoices", path: "/invoices" },
    { icon: <Analytics />, text: "Analytics", path: "/analytics" },
    { icon: <Description />, text: "Reports", path: "/reports" },
    { icon: <Settings />, text: "Settings", path: "/settings" },
  ];

  const quickActions = [
    { icon: <DirectionsCar />, label: "Add New Car", color: "#FF6F61", action: () => navigate("/vehicle/add") },
    { icon: <People />, label: "Add User", color: "#6C63FF", action: () => navigate("/userManagement/add") },
    { icon: <BookOnline />, label: "View Bookings", color: "#FFB400", action: () => navigate("/bookings") },
    { icon: <AttachMoney />, label: "Revenue Report", color: "#00C49F", action: () => navigate("/reports/revenue") },
    { icon: <Notifications />, label: "Notifications", color: "#8A2BE2", action: () => {} },
    { icon: <SupportAgent />, label: "Support Tickets", color: "#36D1DC", action: () => navigate("/support") },
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      overflow: 'hidden',
      position: 'relative',
      background: darkMode 
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    }}>
      {/* Animated Background */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0,
      }}>
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0,
              scale: 0,
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
            }}
            animate={{ 
              opacity: [0, 0.3, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
            style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              background: '#FF6F61',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </Box>

      {/* Main Layout */}
      <Box sx={{ display: 'flex', height: '100vh', position: 'relative', zIndex: 1 }}>
        {/* Sidebar - Fixed */}
        <Box sx={{
          width: drawerWidth,
          bgcolor: darkMode ? '#1e293b' : '#ffffff',
          borderRight: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          zIndex: 100,
        }}>
          {/* Sidebar Header */}
          <Box sx={{ 
            p: 3, 
            borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}>
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
              <DirectionsCar sx={{ 
                fontSize: 36, 
                color: '#FF6F61',
                filter: 'drop-shadow(0 2px 4px rgba(255, 111, 97, 0.3))'
              }} />
            </motion.div>
            <Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 900,
                background: 'linear-gradient(135deg, #FF6F61 0%, #E55450 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                PremiumRentals
              </Typography>
              <Typography variant="caption" sx={{ 
                color: darkMode ? '#94a3b8' : '#64748b',
                fontWeight: 500,
              }}>
                Admin Dashboard
              </Typography>
            </Box>
          </Box>

          {/* Admin Profile */}
          <Box sx={{ 
            p: 3, 
            borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}>
            <Avatar
              onClick={() => setOpenProfile(true)}
              sx={{
                width: 56,
                height: 56,
                bgcolor: '#FF6F61',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '1.5rem',
                boxShadow: '0 4px 12px rgba(255, 111, 97, 0.3)',
              }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {user?.username}
              </Typography>
              <Chip
                label="Administrator"
                size="small"
                icon={<VerifiedUser sx={{ fontSize: 14 }} />}
                sx={{
                  bgcolor: alpha('#FF6F61', 0.1),
                  color: '#FF6F61',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: 24,
                }}
              />
            </Box>
          </Box>

          {/* Navigation Menu */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
            <Typography variant="caption" sx={{ 
              px: 2,
              color: darkMode ? '#64748b' : '#94a3b8',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 1,
              fontSize: '0.7rem',
              mb: 2,
              display: 'block',
            }}>
              Navigation
            </Typography>
            <List sx={{ p: 0 }}>
              {menuItems.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ListItemButton
                    onClick={() => item.path && navigate(item.path)}
                    sx={{
                      mb: 1,
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: darkMode ? alpha('#FF6F61', 0.1) : alpha('#FF6F61', 0.05),
                      },
                      '&.Mui-selected': {
                        bgcolor: alpha('#FF6F61', 0.15),
                        borderLeft: `3px solid #FF6F61`,
                      }
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: darkMode ? '#94a3b8' : '#64748b',
                      minWidth: 40,
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: 500,
                        fontSize: '0.95rem',
                      }}
                    />
                  </ListItemButton>
                </motion.div>
              ))}
            </List>
          </Box>

          {/* Sidebar Footer */}
          <Box sx={{ 
            p: 3, 
            borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
          }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #FF6F61 0%, #E55450 100%)',
                boxShadow: '0 4px 12px rgba(255, 111, 97, 0.3)',
                fontWeight: 700,
                '&:hover': {
                  boxShadow: '0 8px 20px rgba(255, 111, 97, 0.4)',
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ 
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Top Header */}
          <Box sx={{ 
            p: 3,
            borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
            bgcolor: darkMode ? alpha('#1e293b', 0.8) : alpha('#ffffff', 0.8),
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}>
            <Box>
              <Typography variant="h4" sx={{ 
                fontWeight: 900,
                mb: 1,
                background: darkMode
                  ? 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)'
                  : 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Dashboard Overview
              </Typography>
              <Typography variant="body2" sx={{ 
                color: darkMode ? '#94a3b8' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <CalendarToday sx={{ fontSize: 14 }} />
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center">
              <Tooltip title="Refresh Data">
                <IconButton
                  onClick={fetchStats}
                  sx={{
                    bgcolor: darkMode ? alpha('#fff', 0.1) : alpha('#000', 0.05),
                    color: darkMode ? '#94a3b8' : '#64748b',
                  }}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Toggle Theme">
                <IconButton
                  onClick={() => setDarkMode(!darkMode)}
                  sx={{
                    bgcolor: darkMode ? alpha('#FF6F61', 0.2) : alpha('#FF6F61', 0.1),
                    color: darkMode ? '#FFD700' : '#FF6F61',
                  }}
                >
                  {darkMode ? <WbSunny /> : <NightsStay />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Notifications">
                <Badge badgeContent={3} color="error">
                  <IconButton
                    sx={{
                      bgcolor: darkMode ? alpha('#fff', 0.1) : alpha('#000', 0.05),
                      color: darkMode ? '#94a3b8' : '#64748b',
                    }}
                  >
                    <Notifications />
                  </IconButton>
                </Badge>
              </Tooltip>
            </Stack>
          </Box>

          {/* Main Content Area */}
          <Container maxWidth="xl" sx={{ flex: 1, p: 3 }}>
            {/* Welcome Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card sx={{ 
                mb: 4,
                p: 4,
                borderRadius: 3,
                background: darkMode
                  ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                  : 'linear-gradient(135deg, #FF6F61 0%, #E55450 100%)',
                color: darkMode ? 'white' : 'white',
                boxShadow: '0 20px 40px rgba(255, 111, 97, 0.15)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography variant="h2" sx={{ 
                    fontWeight: 900,
                    mb: 1,
                    fontSize: { xs: '2rem', md: '2.5rem' },
                  }}>
                    Welcome back, {user?.username} 👋
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    mb: 3,
                    opacity: 0.9,
                    fontWeight: 300,
                    fontSize: { xs: '1rem', md: '1.25rem' },
                  }}>
                    Here's what's happening with your business today.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Chip
                      label="📈 12% Growth this month"
                      sx={{
                        bgcolor: alpha('#fff', 0.2),
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      label="🎯 98% Satisfaction Rate"
                      sx={{
                        bgcolor: alpha('#fff', 0.2),
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      label="⚡ Real-time Updates"
                      sx={{
                        bgcolor: alpha('#fff', 0.2),
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
                
                {/* Decorative Elements */}
                <Box sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                }} />
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {stats.map((stat, index) => (
                <Grid item key={index} xs={12} sm={6} md={3}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card sx={{ 
                      height: '100%',
                      p: 3,
                      borderRadius: 3,
                      bgcolor: darkMode ? '#1e293b' : 'white',
                      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      }
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ 
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: alpha(stat.color, 0.1),
                          color: stat.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          {stat.icon}
                        </Box>
                        <Chip
                          label={stat.change}
                          size="small"
                          color={stat.trend === 'up' ? 'success' : 'error'}
                          variant="outlined"
                          icon={stat.trend === 'up' ? <TrendingUp sx={{ fontSize: 14 }} /> : <TrendingDown sx={{ fontSize: 14 }} />}
                        />
                      </Box>
                      
                      <Typography variant="h3" sx={{ 
                        fontWeight: 800, 
                        mb: 0.5,
                        fontSize: { xs: '2rem', md: '2.5rem' },
                        color: darkMode ? 'white' : '#1e293b',
                      }}>
                        <CountUp 
                          end={stat.value} 
                          duration={2}
                          separator=","
                        />
                      </Typography>
                      
                      <Typography variant="body2" sx={{ 
                        color: darkMode ? '#94a3b8' : '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        fontSize: '0.75rem',
                        fontWeight: 500,
                      }}>
                        {stat.title}
                      </Typography>
                      
                      {stat.title === 'Revenue ($)' && (
                        <LinearProgress 
                          variant="determinate" 
                          value={75} 
                          sx={{ 
                            mt: 2,
                            height: 6,
                            borderRadius: 3,
                            bgcolor: alpha(stat.color, 0.2),
                            '& .MuiLinearProgress-bar': {
                              bgcolor: stat.color,
                              borderRadius: 3,
                            }
                          }} 
                        />
                      )}
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Monthly Bookings Chart */}
              <Grid item xs={12} lg={6}>
                <Card sx={{ 
                  p: 3,
                  height: '100%',
                  borderRadius: 3,
                  bgcolor: darkMode ? '#1e293b' : 'white',
                  border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                        Monthly Bookings
                      </Typography>
                      <Typography variant="body2" sx={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                        Total bookings per month
                      </Typography>
                    </Box>
                    <Chip label="This Year" size="small" sx={{ fontWeight: 600 }} />
                  </Box>
                  
                  <Box sx={{ height: 300 }}>
                    {loading ? (
                      <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <ReBarChart data={monthlyBookings}>
                          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                          <XAxis 
                            dataKey="month" 
                            stroke={darkMode ? '#94a3b8' : '#64748b'}
                            fontSize={12}
                          />
                          <YAxis 
                            stroke={darkMode ? '#94a3b8' : '#64748b'}
                            fontSize={12}
                          />
                          <ReTooltip 
                            contentStyle={{ 
                              background: darkMode ? '#1e293b' : 'white',
                              border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                              borderRadius: 8,
                            }}
                          />
                          <Bar 
                            dataKey="bookings" 
                            fill="#FF6F61"
                            radius={[4, 4, 0, 0]}
                          >
                            {monthlyBookings.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={alpha('#FF6F61', 0.8 + index * 0.05)} />
                            ))}
                          </Bar>
                        </ReBarChart>
                      </ResponsiveContainer>
                    )}
                  </Box>
                </Card>
              </Grid>

              {/* Revenue Chart */}
              <Grid item xs={12} lg={6}>
                <Card sx={{ 
                  p: 3,
                  height: '100%',
                  borderRadius: 3,
                  bgcolor: darkMode ? '#1e293b' : 'white',
                  border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                        Revenue Overview
                      </Typography>
                      <Typography variant="body2" sx={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                        Monthly revenue with growth
                      </Typography>
                    </Box>
                    <Chip 
                      label="+23.5%" 
                      size="small" 
                      color="success" 
                      icon={<TrendingUp />}
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>
                  
                  <Box sx={{ height: 300 }}>
                    {loading ? (
                      <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <ReLineChart data={monthlyRevenue}>
                          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                          <XAxis 
                            dataKey="month" 
                            stroke={darkMode ? '#94a3b8' : '#64748b'}
                            fontSize={12}
                          />
                          <YAxis 
                            stroke={darkMode ? '#94a3b8' : '#64748b'}
                            fontSize={12}
                          />
                          <ReTooltip 
                            contentStyle={{ 
                              background: darkMode ? '#1e293b' : 'white',
                              border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                              borderRadius: 8,
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#00C49F" 
                            strokeWidth={3}
                            dot={{ fill: '#00C49F', r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </ReLineChart>
                      </ResponsiveContainer>
                    )}
                  </Box>
                </Card>
              </Grid>
            </Grid>

            {/* Bottom Section */}
            <Grid container spacing={3}>
              {/* Car Categories */}
              <Grid item xs={12} md={4}>
                <Card sx={{ 
                  p: 3,
                  height: '100%',
                  borderRadius: 3,
                  bgcolor: darkMode ? '#1e293b' : 'white',
                  border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                    Car Categories
                  </Typography>
                  
                  <Box sx={{ height: 300 }}>
                    {loading ? (
                      <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          <Pie
                            data={carCategoryDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {carCategoryDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <ReTooltip />
                          <Legend />
                        </RePieChart>
                      </ResponsiveContainer>
                    )}
                  </Box>
                </Card>
              </Grid>

              {/* Recent Bookings */}
              <Grid item xs={12} md={8}>
                <Card sx={{ 
                  p: 3,
                  height: '100%',
                  borderRadius: 3,
                  bgcolor: darkMode ? '#1e293b' : 'white',
                  border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Recent Bookings
                    </Typography>
                    <Button
                      size="small"
                      endIcon={<ArrowForward />}
                      sx={{ color: '#FF6F61', fontWeight: 600 }}
                      onClick={() => navigate("/bookings")}
                    >
                      View All
                    </Button>
                  </Box>
                  
                  <Box>
                    {loading ? (
                      [1,2,3,4,5].map(i => (
                        <Skeleton key={i} variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 2 }} />
                      ))
                    ) : (
                      recentBookings.map((booking, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            p: 2,
                            mb: 2,
                            borderRadius: 2,
                            bgcolor: darkMode ? alpha('#fff', 0.05) : '#f8fafc',
                            border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                            transition: 'all 0.3s',
                            '&:hover': {
                              bgcolor: darkMode ? alpha('#FF6F61', 0.1) : alpha('#FF6F61', 0.05),
                              borderColor: '#FF6F61',
                            }
                          }}>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {booking.car}
                              </Typography>
                              <Typography variant="caption" sx={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                                Customer: {booking.customer} • {booking.date}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: '#FF6F61' }}>
                                ${booking.amount}
                              </Typography>
                              <Chip
                                label={booking.status}
                                size="small"
                                sx={{
                                  fontWeight: 600,
                                  fontSize: '0.7rem',
                                  bgcolor: booking.status === 'confirmed' ? alpha('#10b981', 0.1) : 
                                          booking.status === 'pending' ? alpha('#f59e0b', 0.1) : 
                                          alpha('#ef4444', 0.1),
                                  color: booking.status === 'confirmed' ? '#10b981' : 
                                        booking.status === 'pending' ? '#f59e0b' : '#ef4444',
                                }}
                              />
                            </Box>
                          </Box>
                        </motion.div>
                      ))
                    )}
                  </Box>
                </Card>
              </Grid>
            </Grid>

            {/* Quick Actions */}
            <Card sx={{ 
              mt: 4,
              p: 3,
              borderRadius: 3,
              bgcolor: darkMode ? '#1e293b' : 'white',
              border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
            }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Quick Actions
              </Typography>
              
              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item xs={6} sm={4} md={2} key={index}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        fullWidth
                        onClick={action.action}
                        sx={{
                          height: 100,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                          borderRadius: 2,
                          bgcolor: alpha(action.color, 0.1),
                          color: darkMode ? 'white' : action.color,
                          border: `1px solid ${alpha(action.color, 0.3)}`,
                          '&:hover': {
                            bgcolor: alpha(action.color, 0.2),
                          }
                        }}
                      >
                        {action.icon}
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {action.label}
                        </Typography>
                      </Button>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Container>
        </Box>
      </Box>

      {/* Profile Dialog */}
      <Dialog
        open={openProfile}
        onClose={() => setOpenProfile(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: darkMode ? '#1e293b' : 'white',
            backgroundImage: 'none'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}>
          <AccountCircle sx={{ color: '#FF6F61' }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Admin Profile
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              textAlign: 'center',
              mb: 2,
            }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: '#FF6F61',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '2.5rem',
                  mb: 3,
                  boxShadow: '0 8px 24px rgba(255, 111, 97, 0.3)',
                }}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
              
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                {user?.username}
              </Typography>
              
              <Chip
                label="Administrator"
                size="small"
                icon={<AdminPanelSettings />}
                sx={{
                  bgcolor: alpha('#FF6F61', 0.1),
                  color: '#FF6F61',
                  fontWeight: 700,
                  mb: 2,
                }}
              />
            </Box>
            
            <Divider />
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                ACCOUNT INFORMATION
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  p: 2,
                  borderRadius: 2,
                  bgcolor: darkMode ? '#0f172a' : '#f8fafc',
                }}>
                  <Email sx={{ mr: 2, color: '#FF6F61' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Email Address
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {user?.email}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  p: 2,
                  borderRadius: 2,
                  bgcolor: darkMode ? '#0f172a' : '#f8fafc',
                }}>
                  <VerifiedUser sx={{ mr: 2, color: '#FF6F61' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Account Role
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {user?.role || 'Administrator'}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setOpenProfile(false)}
            sx={{ fontWeight: 600 }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            onClick={handleLogout}
            startIcon={<ExitToApp />}
            sx={{
              fontWeight: 600,
              background: 'linear-gradient(135deg, #FF6F61 0%, #E55450 100%)',
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}