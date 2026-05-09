import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
  IconButton,
  Fade,
  Zoom,
  CircularProgress,
  Paper,
  InputAdornment,
  Divider,
  alpha,
  useTheme,
  useMediaQuery,
  Chip,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  DirectionsCar,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  ArrowForward,
  Security,
  Dashboard,
  CheckCircle,
  Star,
  CarRental,
  Speed,
  VerifiedUser,
  Facebook,
  Google,
  GitHub,
  WbSunny,
  NightsStay,
  Info,
  Error as ErrorIcon,
} from "@mui/icons-material";

export default function LoginPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:4040/auth/login", form);

      if (res.data.statusCode !== 200) {
        setError(res.data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      const user = res.data.user;
      const token = res.data.token;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("user", JSON.stringify(user));

      const userRole = user.role.replace("ROLE_", "").toUpperCase();

      setSuccess("🎉 Successfully logged in! Redirecting...");

      setTimeout(() => {
        if (userRole === "ADMIN") navigate("/admin-home", { replace: true });
        else if (userRole === "USER") navigate("/customer-home", { replace: true });
        else setError("Unknown role: " + userRole);
      }, 800);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const socialButtons = [
    { icon: <Google />, color: "#DB4437", label: "Google" },
    { icon: <Facebook />, color: "#4267B2", label: "Facebook" },
    { icon: <GitHub />, color: "#333", label: "GitHub" },
  ];

  const features = [
    { icon: <CarRental />, text: "Premium Car Fleet Access", color: "#FF6F61" },
    { icon: <Speed />, text: "Fast Booking Process", color: "#36D1DC" },
    { icon: <VerifiedUser />, text: "Secure & Verified", color: "#5B86E5" },
    { icon: <Star />, text: "Exclusive Member Benefits", color: "#FFD700" },
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      overflow: 'hidden',
      position: 'relative',
      background: darkMode 
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
        : 'linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4,
    }}>
      {/* Animated Background Elements */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0,
      }}>
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0,
              scale: 0,
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
            }}
            animate={{ 
              opacity: [0, 0.7, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
            style={{
              position: 'absolute',
              width: '6px',
              height: '6px',
              background: '#FF6F61',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </Box>

      {/* Main Container */}
      <Box sx={{
        display: 'flex',
        width: '90%',
        maxWidth: 1200,
        minHeight: '85vh',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        zIndex: 1,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${alpha('#fff', 0.1)}`,
        bgcolor: alpha(darkMode ? '#1e293b' : '#ffffff', 0.97),
      }}>
        {/* Left Side - Hero Section */}
        <Box sx={{
          flex: 1,
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 6,
          background: 'linear-gradient(135deg, #FF6F61 0%, #E55450 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <DirectionsCar sx={{ 
                fontSize: 48, 
                color: 'white',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
              }} />
              <Typography variant="h4" sx={{ 
                fontWeight: 900, 
                letterSpacing: 1,
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                PREMIUM<span style={{ color: '#FFD700' }}>RENTALS</span>
              </Typography>
            </Box>

            <Typography variant="h2" sx={{ 
              fontWeight: 900, 
              mb: 3,
              fontSize: '3rem',
              lineHeight: 1.2,
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }}>
              Welcome<br />Back
            </Typography>

            <Typography variant="h6" sx={{ 
              mb: 6, 
              opacity: 0.95,
              fontWeight: 300,
              fontSize: '1.1rem',
              maxWidth: '80%',
            }}>
              Access your premium account and continue your journey with luxury vehicles
            </Typography>
          </motion.div>

          {/* Features List */}
          <Box sx={{ mt: 4 }}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  mb: 3,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha('#fff', 0.15),
                  transition: 'all 0.3s',
                  '&:hover': {
                    bgcolor: alpha('#fff', 0.25),
                    transform: 'translateX(8px)',
                  }
                }}>
                  <Box sx={{
                    p: 1.5,
                    borderRadius: '50%',
                    bgcolor: alpha('#fff', 0.2),
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {feature.text}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>

          {/* Stats */}
          <Box sx={{ 
            display: 'flex', 
            gap: 4, 
            mt: 'auto',
            pt: 4,
            borderTop: `1px solid ${alpha('#fff', 0.2)}`,
          }}>
            {[
              { value: '10K+', label: 'Active Members' },
              { value: '99%', label: 'Satisfaction' },
              { value: '24/7', label: 'Support' },
            ].map((stat, index) => (
              <Box key={index} sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 900, 
                  color: '#FFD700',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" sx={{ 
                  opacity: 0.9,
                  fontSize: '0.75rem',
                }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Right Side - Login Form */}
        <Box sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 4, md: 5, lg: 6 },
          position: 'relative',
        }}>
          {/* Theme Toggle */}
          <Box sx={{ 
            position: 'absolute', 
            top: 24, 
            right: 24,
            display: 'flex',
            gap: 1,
          }}>
            <IconButton
              onClick={() => setDarkMode(!darkMode)}
              sx={{
                bgcolor: darkMode ? alpha('#FF6F61', 0.2) : alpha('#FF6F61', 0.1),
                color: darkMode ? '#FFD700' : '#FF6F61',
                '&:hover': {
                  bgcolor: alpha('#FF6F61', 0.3),
                }
              }}
            >
              {darkMode ? <WbSunny /> : <NightsStay />}
            </IconButton>
          </Box>

          <Box sx={{ 
            maxWidth: 480, 
            margin: 'auto',
            width: '100%',
          }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Header */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" sx={{ 
                  fontWeight: 900,
                  mb: 1,
                  background: 'linear-gradient(135deg, #FF6F61 0%, #E55450 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Sign In
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: darkMode ? 'grey.400' : 'grey.600',
                  mb: 3,
                }}>
                  Access your premium account to manage bookings
                </Typography>
              </Box>

              {/* Error Alert */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Alert 
                      severity="error" 
                      icon={<ErrorIcon />}
                      sx={{ 
                        mb: 3,
                        borderRadius: 2,
                        bgcolor: alpha('#ef4444', 0.1),
                        border: `1px solid ${alpha('#ef4444', 0.2)}`,
                      }}
                    >
                      {error}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Form */}
              <Paper
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  bgcolor: darkMode ? alpha('#1e293b', 0.5) : alpha('#f8fafc', 0.9),
                  border: `1px solid ${darkMode ? '#334155' : alpha('#FF6F61', 0.1)}`,
                  boxShadow: '0 10px 40px rgba(255, 111, 97, 0.1)',
                }}
              >
                {/* Email Field */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" sx={{ 
                    mb: 1, 
                    display: 'block',
                    fontWeight: 600,
                    color: darkMode ? 'grey.300' : '#FF6F61',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    fontSize: '0.75rem',
                  }}>
                    <Email sx={{ fontSize: 14, verticalAlign: 'middle', mr: 1 }} />
                    Email Address
                  </Typography>
                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                    InputProps={{
                      sx: { 
                        borderRadius: 2,
                        bgcolor: darkMode ? alpha('#0f172a', 0.5) : 'white',
                        border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                        '&:hover': {
                          borderColor: '#FF6F61',
                        },
                        '&.Mui-focused': {
                          borderColor: '#FF6F61',
                          boxShadow: '0 0 0 3px rgba(255, 111, 97, 0.1)',
                        }
                      }
                    }}
                  />
                </Box>

                {/* Password Field */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}>
                    <Typography variant="caption" sx={{ 
                      fontWeight: 600,
                      color: darkMode ? 'grey.300' : '#FF6F61',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      fontSize: '0.75rem',
                    }}>
                      <Lock sx={{ fontSize: 14, verticalAlign: 'middle', mr: 1 }} />
                      Password
                    </Typography>
                    <Link 
                      to="/forgot-password"
                      style={{ 
                        color: '#FF6F61',
                        fontSize: '0.875rem',
                        textDecoration: 'none',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      Forgot password?
                      <Info sx={{ fontSize: 16 }} />
                    </Link>
                  </Box>
                  <TextField
                    fullWidth
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: darkMode ? '#94a3b8' : '#64748b' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: { 
                        borderRadius: 2,
                        bgcolor: darkMode ? alpha('#0f172a', 0.5) : 'white',
                        border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                        '&:hover': {
                          borderColor: '#FF6F61',
                        },
                        '&.Mui-focused': {
                          borderColor: '#FF6F61',
                          boxShadow: '0 0 0 3px rgba(255, 111, 97, 0.1)',
                        }
                      }
                    }}
                  />
                </Box>

                {/* Remember Me & Login Button */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 3,
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <input
                      type="checkbox"
                      id="remember"
                      style={{
                        width: 18,
                        height: 18,
                        accentColor: '#FF6F61',
                        cursor: 'pointer',
                      }}
                    />
                    <label 
                      htmlFor="remember"
                      style={{
                        color: darkMode ? '#94a3b8' : '#64748b',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        fontWeight: 500,
                      }}
                    >
                      Remember me
                    </label>
                  </Box>
                </Box>

                {/* Login Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                    variant="contained"
                    size="large"
                    sx={{
                      py: 2,
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: '1rem',
                      letterSpacing: 0.5,
                      background: 'linear-gradient(135deg, #FF6F61 0%, #E55450 100%)',
                      boxShadow: '0 4px 20px rgba(255, 111, 97, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #E55450 0%, #FF6F61 100%)',
                        boxShadow: '0 8px 30px rgba(255, 111, 97, 0.4)',
                      },
                      '&.Mui-disabled': {
                        background: 'linear-gradient(135deg, #FFB3A8 0%, #FF9C95 100%)',
                      }
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                      <>
                        Sign In
                        <ArrowForward sx={{ ml: 1 }} />
                      </>
                    )}
                  </Button>
                </motion.div>

                {/* Divider */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  my: 4 
                }}>
                  <Divider sx={{ 
                    flex: 1, 
                    borderColor: darkMode ? '#334155' : alpha('#FF6F61', 0.2) 
                  }} />
                  <Typography sx={{ 
                    mx: 2, 
                    color: darkMode ? '#94a3b8' : '#64748b',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}>
                    Or continue with
                  </Typography>
                  <Divider sx={{ 
                    flex: 1, 
                    borderColor: darkMode ? '#334155' : alpha('#FF6F61', 0.2) 
                  }} />
                </Box>

                {/* Social Login Buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2,
                  mb: 4,
                }}>
                  {socialButtons.map((social, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        fullWidth
                        variant="outlined"
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          borderColor: darkMode ? '#334155' : alpha('#FF6F61', 0.3),
                          color: darkMode ? '#cbd5e1' : '#475569',
                          '&:hover': {
                            borderColor: social.color,
                            bgcolor: alpha(social.color, 0.05),
                          }
                        }}
                      >
                        {social.icon}
                      </Button>
                    </motion.div>
                  ))}
                </Box>

                {/* Sign Up Link */}
                <Box sx={{ 
                  textAlign: 'center',
                  mt: 3,
                }}>
                  <Typography variant="body2" sx={{ 
                    color: darkMode ? '#94a3b8' : '#64748b',
                    mb: 2,
                    fontSize: '0.875rem',
                  }}>
                    New to PremiumRentals?
                  </Typography>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Link
                      to="/signup"
                      style={{
                        color: '#FF6F61',
                        textDecoration: 'none',
                        fontWeight: 700,
                        fontSize: '1rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '12px 24px',
                        borderRadius: 8,
                        border: `2px solid ${alpha('#FF6F61', 0.3)}`,
                        background: alpha('#FF6F61', 0.05),
                        transition: 'all 0.3s',
                      }}
                    >
                      Create New Account
                      <ArrowForward sx={{ fontSize: 16 }} />
                    </Link>
                  </motion.div>
                </Box>
              </Paper>

              {/* Quick Access Info */}
              <Box sx={{ 
                mt: 4,
                p: 3,
                borderRadius: 2,
                bgcolor: darkMode ? alpha('#0f172a', 0.3) : alpha('#FF6F61', 0.05),
                border: `1px solid ${darkMode ? '#334155' : alpha('#FF6F61', 0.1)}`,
              }}>
                <Typography variant="caption" sx={{ 
                  display: 'block',
                  fontWeight: 600,
                  color: darkMode ? '#94a3b8' : '#FF6F61',
                  mb: 1,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}>
                  <VerifiedUser sx={{ fontSize: 14, verticalAlign: 'middle', mr: 1 }} />
                  Quick Access
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: darkMode ? '#cbd5e1' : '#475569',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                }}>
                  Demo login: <strong>demo@premiumrentals.com</strong> / <strong>demopass123</strong>
                </Typography>
              </Box>

              {/* Security Note */}
              <Typography variant="caption" sx={{ 
                display: 'block',
                textAlign: 'center',
                mt: 3,
                color: darkMode ? '#64748b' : '#94a3b8',
                fontSize: '0.75rem',
              }}>
                <Security sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.5 }} />
                Your information is protected with 256-bit SSL encryption
              </Typography>
            </motion.div>
          </Box>
        </Box>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={2000}
        onClose={() => setSuccess("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={Zoom}
      >
        <Alert 
          severity="success"
          icon={<CheckCircle />}
          sx={{
            borderRadius: 2,
            boxShadow: '0 10px 30px rgba(34, 197, 94, 0.3)',
            bgcolor: '#10b981',
            color: 'white',
            fontWeight: 500,
          }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
}