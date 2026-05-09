import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  Fade,
  Zoom,
  CircularProgress,
  Paper,
  Divider,
  alpha,
  useTheme,
  useMediaQuery,
  Chip,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Person,
  Email,
  Lock,
  Phone,
  DirectionsCar,
  Visibility,
  VisibilityOff,
  ArrowForward,
  CheckCircle,
  Security,
  Star,
  CarRental,
  Speed,
  VerifiedUser,
  AccountCircle,
  Badge,
  Fingerprint,
  WbSunny,
  NightsStay,
  Info,
  Error as ErrorIcon,
} from "@mui/icons-material";

export default function SignUpPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "ROLE_USER",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const steps = ['Account Details', 'Personal Info', 'Confirmation'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    if (name === 'password') {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength === 0) return '#ef4444';
    if (strength <= 2) return '#f59e0b';
    if (strength === 3) return '#10b981';
    return '#3b82f6';
  };

  const getPasswordStrengthText = (strength) => {
    if (strength === 0) return 'Very Weak';
    if (strength <= 2) return 'Weak';
    if (strength === 3) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    
    // Form validation
    if (passwordStrength < 2) {
      setError("Password is too weak. Please use a stronger password.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:4040/auth/register", form);
      if (res.data.statusCode === 200 || res.data.statusCode === 201) {
        setSuccess("🎉 Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
              Start Your<br />Journey
            </Typography>

            <Typography variant="h6" sx={{ 
              mb: 6, 
              opacity: 0.95,
              fontWeight: 300,
              fontSize: '1.1rem',
              maxWidth: '80%',
            }}>
              Join our premium community and unlock exclusive access to luxury vehicles
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

          {/* Benefits Chip */}
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 2, 
            mt: 'auto',
            pt: 4,
            borderTop: `1px solid ${alpha('#fff', 0.2)}`,
          }}>
            {['Free Cancellation', '24/7 Support', 'Best Price Guarantee', 'No Hidden Fees'].map((benefit, index) => (
              <Chip
                key={index}
                label={benefit}
                sx={{
                  bgcolor: alpha('#fff', 0.2),
                  color: 'white',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: alpha('#fff', 0.3),
                  }
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Right Side - Signup Form */}
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
                  Create Account
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: darkMode ? 'grey.400' : 'grey.600',
                  mb: 3,
                }}>
                  Join our premium community today
                </Typography>

                {/* Stepper */}
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              {/* Error/Success Alerts */}
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

              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Alert 
                      severity="success"
                      icon={<CheckCircle />}
                      sx={{ 
                        mb: 3,
                        borderRadius: 2,
                        bgcolor: alpha('#10b981', 0.1),
                        border: `1px solid ${alpha('#10b981', 0.2)}`,
                      }}
                    >
                      {success}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Signup Form */}
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
                {/* Username Field */}
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
                    <Person sx={{ fontSize: 14, verticalAlign: 'middle', mr: 1 }} />
                    Username
                  </Typography>
                  <TextField
                    fullWidth
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
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

                {/* Phone Field */}
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
                    <Phone sx={{ fontSize: 14, verticalAlign: 'middle', mr: 1 }} />
                    Phone Number
                  </Typography>
                  <TextField
                    fullWidth
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
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
                  <Typography variant="caption" sx={{ 
                    mb: 1, 
                    display: 'block',
                    fontWeight: 600,
                    color: darkMode ? 'grey.300' : '#FF6F61',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    fontSize: '0.75rem',
                  }}>
                    <Lock sx={{ fontSize: 14, verticalAlign: 'middle', mr: 1 }} />
                    Password
                  </Typography>
                  <TextField
                    fullWidth
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
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
                  
                  {/* Password Strength Meter */}
                  {form.password && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box sx={{ 
                        mt: 1, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2 
                      }}>
                        <Box sx={{ 
                          flex: 1, 
                          height: 4, 
                          bgcolor: darkMode ? '#334155' : '#e2e8f0',
                          borderRadius: 2,
                          overflow: 'hidden',
                        }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(passwordStrength / 4) * 100}%` }}
                            transition={{ duration: 0.5 }}
                            style={{
                              height: '100%',
                              background: getPasswordStrengthColor(passwordStrength),
                              borderRadius: 2,
                            }}
                          />
                        </Box>
                        <Typography variant="caption" sx={{ 
                          fontWeight: 600,
                          color: getPasswordStrengthColor(passwordStrength),
                          fontSize: '0.75rem',
                        }}>
                          {getPasswordStrengthText(passwordStrength)}
                        </Typography>
                      </Box>
                    </motion.div>
                  )}
                </Box>

                {/* Register Button */}
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
                        Create Account
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
                    Already a member?
                  </Typography>
                  <Divider sx={{ 
                    flex: 1, 
                    borderColor: darkMode ? '#334155' : alpha('#FF6F61', 0.2) 
                  }} />
                </Box>

                {/* Login Link */}
                <Box sx={{ 
                  textAlign: 'center',
                  mt: 3,
                }}>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Link
                      to="/login"
                      style={{
                        color: '#FF6F61',
                        textDecoration: 'none',
                        fontWeight: 700,
                        fontSize: '1rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '8px 16px',
                        borderRadius: 8,
                        border: `2px solid ${alpha('#FF6F61', 0.3)}`,
                        background: alpha('#FF6F61', 0.05),
                        transition: 'all 0.3s',
                      }}
                    >
                      Sign In to Existing Account
                      <ArrowForward sx={{ fontSize: 16 }} />
                    </Link>
                  </motion.div>
                </Box>

                {/* Terms & Conditions */}
                <Typography variant="caption" sx={{ 
                  display: 'block',
                  textAlign: 'center',
                  mt: 4,
                  color: darkMode ? '#64748b' : '#94a3b8',
                  fontSize: '0.75rem',
                  lineHeight: 1.5,
                }}>
                  By creating an account, you agree to our{' '}
                  <Link to="/terms" style={{ color: '#FF6F61', fontWeight: 500 }}>
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" style={{ color: '#FF6F61', fontWeight: 500 }}>
                    Privacy Policy
                  </Link>
                </Typography>
              </Paper>

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
    </Box>
  );
}