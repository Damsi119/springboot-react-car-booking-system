import React, { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Card,
  IconButton,
  Container,
  Grid,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  alpha,
  Stack,
  Paper,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SpeedIcon from "@mui/icons-material/Speed";
import StarIcon from "@mui/icons-material/Star";
import PeopleIcon from "@mui/icons-material/People";
import ShieldIcon from "@mui/icons-material/Shield";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion, useScroll, useTransform } from "framer-motion";
import { keyframes } from "@emotion/react";

// Animation keyframes
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const shimmerAnimation = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

export default function PremiumRentalsHome() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchData, setSearchData] = useState({
    location: "",
    pickUpDate: "",
    returnDate: "",
    carType: "",
  });

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const fleetRef = useRef(null);
  const testimonialsRef = useRef(null);
  const backgroundSectionRef = useRef(null);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = () => {
    // Navigate to signup page with search data
    navigate("/signup", { state: { searchData } });
  };

  const features = [
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: "#FFFFFF" }} />,
      title: "Instant Booking",
      desc: "Reserve your premium vehicle in minutes with our streamlined booking system.",
      gradient: "linear-gradient(135deg, #FF6F61 0%, #FF8E53 100%)",
    },
    {
      icon: <ShieldIcon sx={{ fontSize: 40, color: "#FFFFFF" }} />,
      title: "Full Insurance",
      desc: "Comprehensive coverage included with every rental for complete peace of mind.",
      gradient: "linear-gradient(135deg, #FF6F61 0%, #FF5252 100%)",
    },
    {
      icon: <StarIcon sx={{ fontSize: 40, color: "#FFFFFF" }} />,
      title: "Premium Fleet",
      desc: "Carefully curated selection of luxury and performance vehicles.",
      gradient: "linear-gradient(135deg, #FF8E53 0%, #FF6F61 100%)",
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 40, color: "#FFFFFF" }} />,
      title: "24/7 Support",
      desc: "Round-the-clock assistance for all your rental needs.",
      gradient: "linear-gradient(135deg, #FF5252 0%, #FF6F61 100%)",
    },
  ];

  const carCategories = [
    { name: "Luxury Sedans", count: "24", color: "#FF6F61", icon: "🏎️" },
    { name: "SUVs", count: "18", color: "#FF8E53", icon: "🚙" },
    { name: "Sports Cars", count: "12", color: "#FF5252", icon: "⚡" },
    { name: "Electric Vehicles", count: "15", color: "#FF6F61", icon: "🔋" },
    { name: "Executive", count: "22", color: "#FF8E53", icon: "👔" },
    { name: "Convertibles", count: "8", color: "#FF5252", icon: "🌅" },
  ];

  const testimonials = [
    {
      name: "Michael Rodriguez",
      role: "Business Executive",
      text: "PremiumRentals exceeded all expectations. The Mercedes S-Class was immaculate and the service was impeccable.",
      avatar: "MR",
      rating: 5,
    },
    {
      name: "Sarah Chen",
      role: "Travel Influencer",
      text: "Best rental experience ever! The Porsche 911 made our coastal road trip unforgettable. Highly recommended!",
      avatar: "SC",
      rating: 5,
    },
    {
      name: "James Wilson",
      role: "Event Planner",
      text: "Reliable, professional, and premium vehicles. Our clients were thoroughly impressed with the service.",
      avatar: "JW",
      rating: 4,
    },
  ];

  const navItems = [
    { label: "Home", ref: heroRef },
    { label: "Features", ref: featuresRef },
    { label: "Fleet", ref: fleetRef },
    { label: "Testimonials", ref: testimonialsRef },
    { label: "Contact", path: "/contact" },
  ];

  const carTypes = ["Luxury Sedan", "SUV", "Sports Car", "Convertible", "Electric", "Minivan"];

  const drawer = (
    <Box sx={{ width: 280, bgcolor: "#1A1A1A", height: "100%", color: "white" }}>
      <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#FF6F61" }}>
          PREMIUMRENTALS
        </Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ bgcolor: "#333" }} />
      <List sx={{ p: 2 }}>
        {navItems.map((item) => (
          <ListItem
            key={item.label}
            onClick={() => {
              if (item.ref) scrollToSection(item.ref);
              handleDrawerToggle();
            }}
            sx={{
              borderRadius: 2,
              mb: 1,
              "&:hover": { bgcolor: "#333" },
              cursor: "pointer",
            }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        <ListItem
          onClick={() => {
            navigate("/login");
            handleDrawerToggle();
          }}
          sx={{
            borderRadius: 2,
            mb: 1,
            "&:hover": { bgcolor: "#333" },
            cursor: "pointer",
          }}
        >
          <ListItemText primary="Login" />
        </ListItem>
        <ListItem
          onClick={() => {
            navigate("/signup");
            handleDrawerToggle();
          }}
          sx={{
            borderRadius: 2,
            bgcolor: "#FF6F61",
            "&:hover": { bgcolor: "#E55450" },
            cursor: "pointer",
          }}
        >
          <ListItemText primary="Sign Up" sx={{ color: "white", textAlign: "center" }} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#0A0A0A", color: "#FFFFFF", overflow: "hidden" }}>
      {/* Navigation Bar */}
      <AppBar
        position="fixed"
        sx={{
          bgcolor: mobileOpen ? "#1A1A1A" : alpha("#1A1A1A", 0.95),
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,111,97,0.3)",
          py: 1,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between", px: { xs: 1, md: 4 } }}>
            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #FF6F61 0%, #FF8E53 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DirectionsCarIcon sx={{ fontSize: 28, color: "white" }} />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  background: "linear-gradient(45deg, #FF6F61, #FF8E53)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.5px",
                }}
              >
                PREMIUMRENTALS
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                {navItems.map((item, i) =>
                  item.ref ? (
                    <Button
                      key={i}
                      onClick={() => scrollToSection(item.ref)}
                      sx={{
                        px: 2.5,
                        textTransform: "none",
                        color: "#FFFFFF",
                        fontWeight: 500,
                        fontSize: "0.95rem",
                        position: "relative",
                        "&:hover": {
                          color: "#FF6F61",
                          "&::after": { width: "100%" },
                        },
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 0,
                          height: "2px",
                          background: "#FF6F61",
                          transition: "width 0.3s ease",
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  ) : (
                    <Button
                      key={i}
                      component={Link}
                      to={item.path}
                      sx={{
                        px: 2.5,
                        textTransform: "none",
                        color: "#FFFFFF",
                        fontWeight: 500,
                        fontSize: "0.95rem",
                        position: "relative",
                        "&:hover": {
                          color: "#FF6F61",
                          "&::after": { width: "100%" },
                        },
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 0,
                          height: "2px",
                          background: "#FF6F61",
                          transition: "width 0.3s ease",
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  )
                )}
                <Button
                  onClick={() => navigate("/login")}
                  sx={{
                    px: 3,
                    py: 1,
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "10px",
                    color: "#FFFFFF",
                    "&:hover": { color: "#FF6F61" },
                    transition: "all 0.3s ease",
                  }}
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate("/signup")}
                  sx={{
                    px: 3,
                    py: 1,
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "10px",
                    background: "linear-gradient(45deg, #FF6F61, #FF8E53)",
                    color: "white",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 10px 25px rgba(255, 111, 97, 0.4)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton onClick={handleDrawerToggle} sx={{ color: "#FFFFFF" }}>
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            bgcolor: "transparent",
            backdropFilter: "blur(10px)",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Hero Section */}
      <Box
        ref={heroRef}
        sx={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          pt: { xs: 10, md: 0 },
          overflow: "hidden",
        }}
      >
        {/* Animated Gradient Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 20% 50%, rgba(255, 111, 97, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 142, 83, 0.2) 0%, transparent 50%)",
            animation: `${floatAnimation} 20s ease-in-out infinite`,
          }}
        />

        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <Chip
                  label="🔥 Premium Experience"
                  sx={{
                    bgcolor: "rgba(255, 111, 97, 0.2)",
                    color: "#FF6F61",
                    border: "1px solid rgba(255, 111, 97, 0.5)",
                    fontWeight: 700,
                    mb: 3,
                    px: 2,
                    py: 1.5,
                    fontSize: "0.9rem",
                  }}
                />
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "2.5rem", md: "4rem", lg: "4.5rem" },
                    fontWeight: 900,
                    lineHeight: 1.1,
                    mb: 3,
                    background: "linear-gradient(45deg, #FF6F61, #FF8E53, #FFD700)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                  }}
                >
                  Drive The
                  <br />
                  <Box component="span" sx={{ fontSize: "1.2em" }}>
                    Extraordinary
                  </Box>
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1.2rem",
                    color: "rgba(255,255,255,0.9)",
                    mb: 5,
                    maxWidth: "600px",
                    lineHeight: 1.6,
                    textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  Experience unparalleled luxury with our curated collection of premium vehicles. From executive sedans to exotic sports cars, we deliver excellence at every turn.
                </Typography>

                {/* CTA Buttons */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 6 }}>
                  <Button
                    onClick={() => navigate("/signup")}
                    sx={{
                      px: 5,
                      py: 2,
                      background: "linear-gradient(45deg, #FF6F61, #FF8E53)",
                      color: "white",
                      fontWeight: 800,
                      fontSize: "1rem",
                      borderRadius: "15px",
                      textTransform: "none",
                      boxShadow: "0 10px 30px rgba(255, 111, 97, 0.4)",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 15px 35px rgba(255, 111, 97, 0.6)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Explore Fleet
                  </Button>
                  <Button
                    onClick={() => scrollToSection(featuresRef)}
                    variant="outlined"
                    sx={{
                      px: 5,
                      py: 2,
                      border: "2px solid rgba(255, 111, 97, 0.5)",
                      color: "white",
                      fontWeight: 700,
                      borderRadius: "15px",
                      textTransform: "none",
                      "&:hover": {
                        borderColor: "#FF6F61",
                        bgcolor: "rgba(255, 111, 97, 0.1)",
                        transform: "translateY(-3px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Learn More
                  </Button>
                </Stack>

                {/* Stats */}
                <Grid container spacing={3} sx={{ maxWidth: "500px" }}>
                  {[
                    { value: "500+", label: "Premium Cars", icon: "🚗" },
                    { value: "24/7", label: "Support", icon: "🛡️" },
                    { value: "98%", label: "Satisfaction", icon: "⭐" },
                    { value: "50+", label: "Locations", icon: "📍" },
                  ].map((stat, i) => (
                    <Grid item xs={6} key={i}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <Typography variant="h4" sx={{ mr: 1 }}>{stat.icon}</Typography>
                        <Typography variant="h3" sx={{ color: "#FF6F61", fontWeight: 900, mb: 0.5 }}>
                          {stat.value}
                        </Typography>
                      </Box>
                      <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", fontWeight: 600 }}>{stat.label}</Typography>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </Grid>
            
            {/* Hero Image Section */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                style={{ position: "relative" }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: { xs: "400px", md: "600px" },
                    background: "linear-gradient(135deg, rgba(255, 111, 97, 0.1) 0%, rgba(255, 142, 83, 0.1) 100%)",
                    borderRadius: "30px",
                    overflow: "hidden",
                    border: "2px solid rgba(255, 111, 97, 0.3)",
                    boxShadow: "0 50px 100px rgba(255, 111, 97, 0.15)",
                  }}
                >
                  {/* Animated Car Image */}
                  <Box
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backgroundImage: "url('https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      animation: `${floatAnimation} 8s ease-in-out infinite`,
                    }}
                  />
                  {/* Gradient Overlay */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(45deg, transparent, rgba(255, 111, 97, 0.2))",
                    }}
                  />
                </Box>

                {/* Floating Elements */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "10%",
                    right: "10%",
                    width: "100px",
                    height: "100px",
                    borderRadius: "20px",
                    background: "linear-gradient(135deg, #FF6F61 0%, #FF8E53 100%)",
                    transform: "rotate(15deg)",
                    animation: `${floatAnimation} 6s ease-in-out infinite 1s`,
                    opacity: 0.8,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "20%",
                    left: "5%",
                    width: "70px",
                    height: "70px",
                    borderRadius: "15px",
                    background: "linear-gradient(135deg, #FF6F61 0%, #FF5252 100%)",
                    transform: "rotate(-10deg)",
                    animation: `${floatAnimation} 7s ease-in-out infinite 0.5s`,
                    opacity: 0.8,
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Search Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: "20px",
            background: "linear-gradient(135deg, rgba(255, 111, 97, 0.1) 0%, rgba(26, 26, 26, 0.9) 100%)",
            border: "2px solid rgba(255, 111, 97, 0.3)",
            backdropFilter: "blur(20px)",
            transform: "translateY(-50%)",
            position: "relative",
            zIndex: 10,
            boxShadow: "0 25px 50px rgba(255, 111, 97, 0.2)",
          }}
        >
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 800, textAlign: "center", color: "#FF6F61" }}>
            Find Your Perfect Ride
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Pick-up Location"
                value={searchData.location}
                onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon sx={{ color: "#FF6F61" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    bgcolor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    "&:hover": { borderColor: "#FF6F61" },
                    color: "white",
                    "& .MuiInputBase-input::placeholder": {
                      color: "rgba(255,255,255,0.5)",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                type="date"
                placeholder="Pick-up Date"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon sx={{ color: "#FF6F61" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    bgcolor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    "&:hover": { borderColor: "#FF6F61" },
                    color: "white",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                type="date"
                placeholder="Return Date"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon sx={{ color: "#FF6F61" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    bgcolor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    "&:hover": { borderColor: "#FF6F61" },
                    color: "white",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                onClick={handleMenuOpen}
                endIcon={<ExpandMoreIcon />}
                sx={{
                  height: "56px",
                  borderRadius: "12px",
                  bgcolor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "1rem",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#FF6F61",
                    bgcolor: "rgba(255, 111, 97, 0.1)",
                  },
                  justifyContent: "space-between",
                  px: 2,
                }}
              >
                {searchData.carType || "Car Type"}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    bgcolor: "#1A1A1A",
                    color: "white",
                    mt: 1,
                    borderRadius: "12px",
                    border: "1px solid rgba(255,111,97,0.3)",
                  },
                }}
              >
                {carTypes.map((type) => (
                  <MenuItem
                    key={type}
                    onClick={() => {
                      setSearchData({ ...searchData, carType: type });
                      handleMenuClose();
                    }}
                    sx={{
                      "&:hover": { bgcolor: "rgba(255,111,97,0.2)" },
                    }}
                  >
                    {type}
                  </MenuItem>
                ))}
              </Menu>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                onClick={handleSearch}
                sx={{
                  height: "56px",
                  borderRadius: "12px",
                  background: "linear-gradient(45deg, #FF6F61, #FF8E53)",
                  color: "white",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  textTransform: "none",
                  boxShadow: "0 10px 20px rgba(255, 111, 97, 0.3)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 15px 30px rgba(255, 111, 97, 0.5)",
                  },
                  transition: "all 0.3s ease",
                }}
                startIcon={<SearchIcon />}
              >
                Search Cars
              </Button>
            </Grid>
          </Grid>
          <Typography sx={{ textAlign: "center", color: "rgba(255,255,255,0.7)", mt: 3, fontSize: "0.9rem" }}>
            Click "Search Cars" to book your premium vehicle
          </Typography>
        </Paper>
      </Container>

      {/* Features Section */}
      <Box ref={featuresRef} sx={{ py: 10, position: "relative", bgcolor: "#111111" }}>
        <Container maxWidth="xl">
          <Typography variant="h2" sx={{ textAlign: "center", mb: 2, fontWeight: 900, color: "#FF6F61" }}>
            Why Choose <Box component="span" sx={{ color: "#FFFFFF" }}>PremiumRentals</Box>
          </Typography>
          <Typography sx={{ textAlign: "center", color: "rgba(255,255,255,0.8)", mb: 8, fontSize: "1.1rem", maxWidth: "600px", mx: "auto" }}>
            Experience the difference with our premium services and exceptional customer care
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                  <Card
                    sx={{
                      p: 4,
                      height: "100%",
                      borderRadius: "20px",
                      background: feature.gradient,
                      color: "white",
                      position: "relative",
                      overflow: "hidden",
                      border: "none",
                      "&:hover": {
                        transform: "translateY(-10px) scale(1.02)",
                        "& .feature-icon": {
                          transform: "scale(1.1) rotate(5deg)",
                        },
                      },
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
                    }}
                  >
                    {/* Background Pattern */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: -50,
                        right: -50,
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        bgcolor: "rgba(255,255,255,0.1)",
                      }}
                    />

                    {/* Icon */}
                    <Box
                      className="feature-icon"
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "20px",
                        bgcolor: "rgba(255,255,255,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                        transition: "transform 0.3s ease",
                      }}
                    >
                      {feature.icon}
                    </Box>

                    {/* Content */}
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, position: "relative" }}>
                      {feature.title}
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.9)", fontSize: "0.95rem", lineHeight: 1.6, position: "relative" }}>
                      {feature.desc}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Fleet Categories */}
      <Box ref={fleetRef} sx={{ py: 10, bgcolor: "#0A0A0A", position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: "linear-gradient(90deg, transparent, #FF6F61, transparent)",
          }}
        />
        <Container maxWidth="xl">
          <Typography variant="h2" sx={{ textAlign: "center", mb: 2, fontWeight: 900, color: "#FFFFFF" }}>
            Our <Box component="span" sx={{ color: "#FF6F61" }}>Premium Fleet</Box>
          </Typography>
          <Typography sx={{ textAlign: "center", color: "rgba(255,255,255,0.8)", mb: 8, fontSize: "1.1rem", maxWidth: "600px", mx: "auto" }}>
            Choose from our exclusive collection of luxury vehicles
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {carCategories.map((category, i) => (
              <Grid item xs={6} sm={4} md={2} key={i}>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: i * 0.1 }}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: "15px",
                      textAlign: "center",
                      bgcolor: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: "rgba(255, 111, 97, 0.1)",
                        borderColor: "#FF6F61",
                        transform: "translateY(-5px)",
                        boxShadow: "0 10px 20px rgba(255, 111, 97, 0.2)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Typography variant="h3" sx={{ mb: 1, fontSize: "2.5rem" }}>
                      {category.icon}
                    </Typography>
                    <Typography sx={{ fontWeight: 700, mb: 0.5, fontSize: "0.95rem" }}>{category.name}</Typography>
                    <Typography sx={{ color: "#FF6F61", fontSize: "0.9rem", fontWeight: 800 }}>{category.count} Cars</Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Background Image Section - Under the page */}
      <Box
        ref={backgroundSectionRef}
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: "60vh", md: "80vh" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "url('https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(45deg, rgba(0,0,0,0.8) 0%, rgba(255,111,97,0.4) 100%)",
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Typography variant="h2" sx={{ color: "#FFFFFF", fontWeight: 900, mb: 3 }}>
              Experience Luxury On Wheels
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.9)", mb: 4, fontSize: { xs: "1rem", md: "1.2rem" }, maxWidth: "800px", mx: "auto" }}>
              Our premium collection features the finest vehicles from luxury sedans to high-performance sports cars, all maintained to perfection for your ultimate driving pleasure.
            </Typography>
            <Button
              onClick={() => navigate("/explore")}
              sx={{
                px: 5,
                py: 2,
                borderRadius: "15px",
                backgroundColor: "#FF6F61",
                color: "#fff",
                textTransform: "none",
                fontWeight: 800,
                fontSize: "1.1rem",
                "&:hover": {
                  backgroundColor: "#E55450",
                  transform: "translateY(-3px)",
                  boxShadow: "0 15px 30px rgba(255, 111, 97, 0.4)",
                },
                transition: "all 0.3s ease",
              }}
            >
              View All Vehicles
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box ref={testimonialsRef} sx={{ py: 10, bgcolor: "#111111", position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: "linear-gradient(90deg, transparent, #FF8E53, transparent)",
          }}
        />
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ textAlign: "center", mb: 8, fontWeight: 900, color: "#FFFFFF" }}>
            What Our <Box component="span" sx={{ color: "#FF6F61" }}>Clients Say</Box>
          </Typography>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, i) => (
              <Grid item xs={12} md={4} key={i}>
                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.2 }}>
                  <Card
                    sx={{
                      p: 4,
                      height: "100%",
                      borderRadius: "20px",
                      bgcolor: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,111,97,0.2)",
                      backdropFilter: "blur(10px)",
                      "&:hover": {
                        borderColor: "#FF6F61",
                        transform: "translateY(-5px)",
                        boxShadow: "0 15px 30px rgba(255, 111, 97, 0.2)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          bgcolor: "rgba(255, 111, 97, 0.2)",
                          color: "#FF6F61",
                          fontWeight: 800,
                          fontSize: "1.2rem",
                          mr: 2,
                        }}
                      >
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: "#FFFFFF" }}>
                          {testimonial.name}
                        </Typography>
                        <Typography sx={{ color: "#FF6F61", fontSize: "0.9rem", fontWeight: 600 }}>{testimonial.role}</Typography>
                      </Box>
                    </Box>
                    <Typography sx={{ color: "rgba(255,255,255,0.9)", fontStyle: "italic", lineHeight: 1.7, mb: 3 }}>
                      "{testimonial.text}"
                    </Typography>
                    <Box sx={{ display: "flex", color: "#FF8E53" }}>
                      {[...Array(5)].map((_, index) => (
                        <StarIcon
                          key={index}
                          sx={{
                            fontSize: 20,
                            color: index < testimonial.rating ? "#FF8E53" : "rgba(255,255,255,0.3)",
                          }}
                        />
                      ))}
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 15, position: "relative", overflow: "hidden", bgcolor: "#0A0A0A" }}>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "url('https://wallpaperbat.com/img/878447-wallpaper-vehicles-nissan-gt-r-phone-wallpaper-white-car-car-supercar-vehicle-nissan-1080x1920-free-download.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.1,
          }}
        />
        <Container maxWidth="lg">
          <Box
            sx={{
              p: { xs: 4, md: 8 },
              borderRadius: "30px",
              background: "linear-gradient(135deg, rgba(255, 111, 97, 0.15) 0%, rgba(26, 26, 26, 0.9) 100%)",
              border: "2px solid rgba(255, 111, 97, 0.3)",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 30px 60px rgba(255, 111, 97, 0.2)",
            }}
          >
            {/* Animated Background */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(90deg, transparent, rgba(255,142,83,0.1), transparent)",
                animation: `${shimmerAnimation} 3s infinite linear`,
              }}
            />

            <Typography variant="h2" sx={{ mb: 3, fontWeight: 900, position: "relative", color: "#FFFFFF" }}>
              Ready to Experience{" "}
              <Box component="span" sx={{ color: "#FF6F61" }}>
                Premium
              </Box>
              ?
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.9)", mb: 5, fontSize: "1.2rem", maxWidth: "600px", mx: "auto", position: "relative", fontWeight: 500 }}>
              Join thousands of satisfied customers and elevate your driving experience today.
            </Typography>
            <Button
              onClick={() => navigate("/signup")}
              sx={{
                px: 6,
                py: 2.5,
                background: "linear-gradient(45deg, #FF6F61, #FF8E53)",
                color: "white",
                fontWeight: 900,
                fontSize: "1.2rem",
                borderRadius: "15px",
                textTransform: "none",
                position: "relative",
                boxShadow: "0 15px 35px rgba(255, 111, 97, 0.4)",
                "&:hover": {
                  transform: "translateY(-5px) scale(1.05)",
                  boxShadow: "0 25px 50px rgba(255, 111, 97, 0.6)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Get Started Now
            </Button>
            <Typography sx={{ color: "rgba(255,255,255,0.7)", mt: 3, fontSize: "0.9rem", position: "relative" }}>
              No credit card required • Free cancellation • 24/7 support
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "#1A1A1A", borderTop: "2px solid rgba(255,111,97,0.3)", pt: 8, pb: 4, position: "relative" }}>
        <Container maxWidth="xl">
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "15px",
                    background: "linear-gradient(135deg, #FF6F61 0%, #FF8E53 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 2,
                    boxShadow: "0 10px 20px rgba(255, 111, 97, 0.3)",
                  }}
                >
                  <DirectionsCarIcon sx={{ fontSize: 32, color: "white" }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: "#FFFFFF" }}>
                  PREMIUMRENTALS
                </Typography>
              </Box>
              <Typography sx={{ color: "rgba(255,255,255,0.7)", mb: 4, lineHeight: 1.6 }}>
                Redefining luxury mobility with premium vehicles and exceptional service. Experience the future of car rentals today.
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                {[
                  { icon: FacebookIcon, color: "#1877F2" },
                  { icon: InstagramIcon, color: "#E4405F" },
                  { icon: TwitterIcon, color: "#1DA1F2" },
                  { icon: LinkedInIcon, color: "#0A66C2" },
                ].map((item, i) => (
                  <IconButton
                    key={i}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.05)",
                      "&:hover": {
                        bgcolor: item.color,
                        transform: "translateY(-3px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <item.icon sx={{ color: "white" }} />
                  </IconButton>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={4}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, color: "#FF6F61" }}>
                    Company
                  </Typography>
                  {["About Us", "Careers", "Press", "Blog"].map((item) => (
                    <Typography
                      key={item}
                      sx={{
                        color: "rgba(255,255,255,0.7)",
                        mb: 1.5,
                        "&:hover": { color: "#FF6F61", cursor: "pointer", transform: "translateX(5px)" },
                        transition: "all 0.2s ease",
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, color: "#FF6F61" }}>
                    Services
                  </Typography>
                  {["Car Rental", "Chauffeur", "Airport Transfer", "Corporate"].map((item) => (
                    <Typography
                      key={item}
                      sx={{
                        color: "rgba(255,255,255,0.7)",
                        mb: 1.5,
                        "&:hover": { color: "#FF6F61", cursor: "pointer", transform: "translateX(5px)" },
                        transition: "all 0.2s ease",
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, color: "#FF6F61" }}>
                    Support
                  </Typography>
                  {["Help Center", "Contact Us", "FAQ", "Insurance"].map((item) => (
                    <Typography
                      key={item}
                      sx={{
                        color: "rgba(255,255,255,0.7)",
                        mb: 1.5,
                        "&:hover": { color: "#FF6F61", cursor: "pointer", transform: "translateX(5px)" },
                        transition: "all 0.2s ease",
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, color: "#FF6F61" }}>
                    Contact
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <PhoneIcon sx={{ fontSize: 18, color: "#FF6F61", mr: 1.5 }} />
                    <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>+94 77 123 4567</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <EmailIcon sx={{ fontSize: 18, color: "#FF6F61", mr: 1.5 }} />
                    <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>info@premiumrentals.lk</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LocationOnIcon sx={{ fontSize: 18, color: "#FF6F61", mr: 1.5 }} />
                    <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>Colombo, Sri Lanka</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ my: 6, bgcolor: "rgba(255,255,255,0.1)" }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
            <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
              &copy; {new Date().getFullYear()} PREMIUMRENTALS. All rights reserved.
            </Typography>
            <Box sx={{ display: "flex", gap: 3 }}>
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <Typography
                  key={item}
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "0.9rem",
                    "&:hover": { color: "#FF6F61", cursor: "pointer" },
                    transition: "color 0.2s ease",
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}