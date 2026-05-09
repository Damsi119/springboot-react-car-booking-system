import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  Paper,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  Slider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  alpha,
  Stack,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Notifications as NotificationsIcon,
  NotificationsOff as NotificationsOffIcon,
  ViewCompact as ViewCompactIcon,
  ViewAgenda as ViewAgendaIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  Security as SecurityIcon,
  AccountCircle as AccountCircleIcon,
  PrivacyTip as PrivacyTipIcon,
  Backup as BackupIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Logout as LogoutIcon,
  Info as InfoIcon,
  Email as EmailIcon,
  VolumeUp as VolumeUpIcon,
  Visibility as VisibilityIcon,
  Speed as SpeedIcon,
  DataUsage as DataUsageIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon,
  Download as DownloadIcon,
  Cloud as CloudIcon,
  Shield as ShieldIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";
import axios from "axios";

const StyledSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#FF6F61',
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#FF6F61',
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: `0 15px 35px ${alpha(theme.palette.primary.main, 0.1)}`,
    backgroundColor: alpha(theme.palette.primary.main, 0.02),
  },
  height: '100%',
}));

const SettingSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

export default function Settings({ darkMode, setDarkMode }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    JSON.parse(localStorage.getItem("notificationsEnabled")) ?? true
  );
  const [compactView, setCompactView] = useState(
    JSON.parse(localStorage.getItem("compactView")) ?? false
  );
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);
  const [language, setLanguage] = useState("en");
  const [fontSize, setFontSize] = useState(16);
  const [themeColor, setThemeColor] = useState("#FF6F61");
  const [saveStatus, setSaveStatus] = useState("idle");
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    memberSince: "",
    role: "",
    id: "",
    phoneNumber: "",
    fullName: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const themeColors = [
    { name: "Coral", value: "#FF6F61" },
    { name: "Blue", value: "#2196F3" },
    { name: "Purple", value: "#9C27B0" },
    { name: "Green", value: "#4CAF50" },
    { name: "Amber", value: "#FF9800" },
    { name: "Teal", value: "#009688" },
  ];

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "ja", name: "日本語" },
  ];

  const features = [
    {
      title: "Smart Notifications",
      description: "AI-powered notification filtering",
      icon: <NotificationsIcon />,
      enabled: true,
    },
    {
      title: "Advanced Analytics",
      description: "Real-time performance insights",
      icon: <SpeedIcon />,
      enabled: false,
    },
    {
      title: "Cloud Backup",
      description: "Automatic data backup",
      icon: <CloudIcon />,
      enabled: true,
    },
    {
      title: "Enhanced Security",
      description: "Two-factor authentication",
      icon: <ShieldIcon />,
      enabled: false,
    },
  ];

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("No authentication token found");
          return;
        }

        const response = await axios.get(
          "http://localhost:4040/users/get-logged-in-profile-info",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.data) {
          const userDataFromApi = response.data.data;
          
          // Format the data based on your API response structure
          setUserData({
            username: userDataFromApi.username || userDataFromApi.email?.split('@')[0] || "User",
            email: userDataFromApi.email || "",
            memberSince: userDataFromApi.createdAt 
              ? new Date(userDataFromApi.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              : new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }),
            role: userDataFromApi.role?.replace("ROLE_", "") || "User",
            id: userDataFromApi.id || "N/A",
            phoneNumber: userDataFromApi.phoneNumber || "Not provided",
            fullName: userDataFromApi.fullName || userDataFromApi.username || "User",
          });
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load profile data");
        
        // Fallback to localStorage data
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (storedUser) {
          setUserData({
            username: storedUser.username || "User",
            email: storedUser.email || "",
            memberSince: storedUser.createdAt 
              ? new Date(storedUser.createdAt).toLocaleDateString()
              : new Date().toLocaleDateString(),
            role: storedUser.role?.replace("ROLE_", "") || "User",
            id: storedUser.id || "N/A",
            phoneNumber: storedUser.phoneNumber || "Not provided",
            fullName: storedUser.fullName || storedUser.username || "User",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    localStorage.setItem("notificationsEnabled", JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);

  useEffect(() => {
    localStorage.setItem("compactView", JSON.stringify(compactView));
  }, [compactView]);

  const handleSaveAll = () => {
    setSaveStatus("saving");
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem("settings", JSON.stringify({
        notificationsEnabled,
        compactView,
        emailNotifications,
        soundEnabled,
        autoSave,
        dataSaver,
        language,
        fontSize,
        themeColor,
      }));
      setSaveStatus("saved");
      
      // Reset status after 2 seconds
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 1000);
  };

  const handleReset = () => {
    setNotificationsEnabled(true);
    setCompactView(false);
    setEmailNotifications(true);
    setSoundEnabled(true);
    setAutoSave(true);
    setDataSaver(false);
    setLanguage("en");
    setFontSize(16);
    setThemeColor("#FF6F61");
  };

  const handleExportData = () => {
    const data = {
      user: userData,
      settings: {
        notificationsEnabled,
        compactView,
        emailNotifications,
        soundEnabled,
        autoSave,
        dataSaver,
        language,
        fontSize,
        themeColor,
      },
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `settings-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearCache = () => {
    localStorage.removeItem('appCache');
    // Show success message
    setSaveStatus("cacheCleared");
    setTimeout(() => setSaveStatus("idle"), 2000);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} sx={{ color: '#FF6F61' }} />
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: darkMode 
        ? 'linear-gradient(135deg, #121212 0%, #1a1a1a 100%)'
        : 'linear-gradient(135deg, #f8f9ff 0%, #eef2ff 100%)',
      py: 6,
      px: 2,
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography variant="h3" sx={{
              fontWeight: 800,
              background: 'linear-gradient(45deg, #FF6F61, #FF8E53)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}>
              Settings & Preferences
            </Typography>
            <Typography variant="h6" sx={{
              color: darkMode ? '#bbb' : '#666',
              fontWeight: 400,
              maxWidth: 600,
              mx: 'auto',
            }}>
              Customize your experience and manage your account preferences
            </Typography>
          </Box>
        </motion.div>

        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <SettingSection elevation={0} sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{
                width: 80,
                height: 80,
                bgcolor: themeColor,
                fontSize: 32,
                mr: 3,
              }}>
                {userData.username.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {userData.fullName}
                </Typography>
                <Typography variant="body2" sx={{ color: darkMode ? '#bbb' : '#666', mb: 1 }}>
                  {userData.email}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip 
                    label={`Member since ${userData.memberSince}`} 
                    size="small" 
                    icon={<AccountCircleIcon />}
                    sx={{ borderRadius: 2 }}
                  />
                  <Chip 
                    label={userData.role} 
                    size="small" 
                    color="primary"
                    sx={{ borderRadius: 2 }}
                  />
                  <Chip 
                    label={`ID: ${userData.id}`} 
                    size="small" 
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  />
                </Box>
                {error && (
                  <Alert severity="warning" sx={{ mt: 1, borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}
              </Box>
            </Box>
            
            {/* Additional User Info */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: darkMode ? '#bbb' : '#666', display: 'block' }}>
                  Phone Number
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {userData.phoneNumber}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: darkMode ? '#bbb' : '#666', display: 'block' }}>
                  Username
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {userData.username}
                </Typography>
              </Grid>
            </Grid>
          </SettingSection>
        </motion.div>

        {/* Rest of the settings code remains the same */}
        <Grid container spacing={4}>
          {/* Left Column - Main Settings */}
          <Grid item xs={12} md={8}>
            {/* Appearance Settings */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SettingSection elevation={0} sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PaletteIcon sx={{ color: themeColor }} />
                  Appearance
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
                        <Typography>Dark Mode</Typography>
                      </Box>
                      <StyledSwitch
                        checked={darkMode}
                        onChange={() => setDarkMode(!darkMode)}
                        size="medium"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {compactView ? <ViewCompactIcon /> : <ViewAgendaIcon />}
                        <Typography>Compact View</Typography>
                      </Box>
                      <StyledSwitch
                        checked={compactView}
                        onChange={() => setCompactView(!compactView)}
                        size="medium"
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel>Language</InputLabel>
                      <Select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        label="Language"
                        startAdornment={<LanguageIcon sx={{ mr: 1, color: themeColor }} />}
                      >
                        {languages.map((lang) => (
                          <MenuItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <VisibilityIcon />
                        Font Size: {fontSize}px
                      </Typography>
                      <Slider
                        value={fontSize}
                        onChange={(e, newValue) => setFontSize(newValue)}
                        min={12}
                        max={24}
                        step={1}
                        sx={{ color: themeColor }}
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    Theme Color
                  </Typography>
                  <Grid container spacing={1}>
                    {themeColors.map((color) => (
                      <Grid item key={color.value}>
                        <Tooltip title={color.name}>
                          <IconButton
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: color.value,
                              border: themeColor === color.value ? `3px solid ${alpha(color.value, 0.5)}` : 'none',
                              '&:hover': {
                                bgcolor: color.value,
                                transform: 'scale(1.1)',
                              },
                            }}
                            onClick={() => setThemeColor(color.value)}
                          >
                            {themeColor === color.value && <CheckCircleIcon sx={{ color: 'white' }} />}
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </SettingSection>
            </motion.div>

            {/* Notification Settings */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <SettingSection elevation={0} sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NotificationsIcon sx={{ color: themeColor }} />
                  Notifications
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <NotificationsIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Push Notifications" 
                      secondary="Receive browser notifications"
                    />
                    <ListItemSecondaryAction>
                      <StyledSwitch
                        checked={notificationsEnabled}
                        onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Email Notifications" 
                      secondary="Receive updates via email"
                    />
                    <ListItemSecondaryAction>
                      <StyledSwitch
                        checked={emailNotifications}
                        onChange={() => setEmailNotifications(!emailNotifications)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <VolumeUpIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Sound Effects" 
                      secondary="Play sounds for notifications"
                    />
                    <ListItemSecondaryAction>
                      <StyledSwitch
                        checked={soundEnabled}
                        onChange={() => setSoundEnabled(!soundEnabled)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </SettingSection>
            </motion.div>

            {/* Advanced Features */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <SettingSection elevation={0}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarIcon sx={{ color: themeColor }} />
                  Advanced Features
                </Typography>
                
                <Grid container spacing={3}>
                  {features.map((feature, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <FeatureCard>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ bgcolor: alpha(themeColor, 0.1), color: themeColor, mr: 2 }}>
                              {feature.icon}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {feature.title}
                              </Typography>
                              <Typography variant="caption" sx={{ color: darkMode ? '#bbb' : '#666' }}>
                                {feature.description}
                              </Typography>
                            </Box>
                            <StyledSwitch
                              size="small"
                              checked={feature.enabled}
                              sx={{ ml: 'auto' }}
                            />
                          </Box>
                          <Button 
                            variant="outlined" 
                            size="small" 
                            fullWidth
                            sx={{ borderRadius: 2 }}
                          >
                            Configure
                          </Button>
                        </CardContent>
                      </FeatureCard>
                    </Grid>
                  ))}
                </Grid>
              </SettingSection>
            </motion.div>
          </Grid>

          {/* Right Column - Actions & Privacy */}
          <Grid item xs={12} md={4}>
            {/* Privacy & Security */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <SettingSection elevation={0} sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SecurityIcon sx={{ color: themeColor }} />
                  Privacy & Security
                </Typography>
                
                <List>
                  <ListItem button>
                    <ListItemIcon>
                      <PrivacyTipIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Privacy Settings" 
                      secondary="Manage your data preferences"
                    />
                  </ListItem>
                  
                  <ListItem button>
                    <ListItemIcon>
                      <ShieldIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Security Center" 
                      secondary="View security activity"
                    />
                  </ListItem>
                  
                  <ListItem button>
                    <ListItemIcon>
                      <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Clear Cache" 
                      secondary="Remove temporary files"
                    />
                    <ListItemSecondaryAction>
                      <IconButton onClick={handleClearCache}>
                        <RefreshIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </SettingSection>
            </motion.div>

            {/* Data Management */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <SettingSection elevation={0} sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BackupIcon sx={{ color: themeColor }} />
                  Data Management
                </Typography>
                
                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    fullWidth
                    sx={{ borderRadius: 2, py: 1.5 }}
                    onClick={handleExportData}
                  >
                    Export All Data
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<CloudIcon />}
                    fullWidth
                    sx={{ borderRadius: 2, py: 1.5 }}
                    onClick={handleClearCache}
                  >
                    Clear App Cache
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<LogoutIcon />}
                    fullWidth
                    sx={{ borderRadius: 2, py: 1.5 }}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    fullWidth
                    sx={{ borderRadius: 2, py: 1.5, color: '#f44336', borderColor: '#f44336' }}
                  >
                    Delete Account
                  </Button>
                </Stack>
              </SettingSection>
            </motion.div>

            {/* Performance */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <SettingSection elevation={0}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SpeedIcon sx={{ color: themeColor }} />
                  Performance
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Auto-save</Typography>
                    <StyledSwitch
                      size="small"
                      checked={autoSave}
                      onChange={() => setAutoSave(!autoSave)}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Data Saver Mode</Typography>
                    <StyledSwitch
                      size="small"
                      checked={dataSaver}
                      onChange={() => setDataSaver(!dataSaver)}
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: darkMode ? '#bbb' : '#666' }}>
                    Storage Usage
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption">2.3 GB of 5 GB used</Typography>
                        <Typography variant="caption">46%</Typography>
                      </Box>
                      <Box sx={{ 
                        height: 8, 
                        bgcolor: darkMode ? '#333' : '#e0e0e0', 
                        borderRadius: 4,
                        overflow: 'hidden'
                      }}>
                        <Box sx={{ 
                          width: '46%', 
                          height: '100%', 
                          bgcolor: themeColor,
                          borderRadius: 4,
                        }} />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </SettingSection>
            </motion.div>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Box sx={{ 
            mt: 6, 
            p: 3, 
            borderRadius: 3,
            background: darkMode 
              ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(40, 40, 40, 0.8) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 248, 248, 0.9) 100%)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(darkMode ? '#333' : '#ddd', 0.2)}`,
          }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                {saveStatus === "saving" && (
                  <Alert severity="info" icon={<CircularProgress size={20} />} sx={{ borderRadius: 2 }}>
                    Saving settings...
                  </Alert>
                )}
                {saveStatus === "saved" && (
                  <Alert severity="success" sx={{ borderRadius: 2 }}>
                    Settings saved successfully!
                  </Alert>
                )}
                {saveStatus === "cacheCleared" && (
                  <Alert severity="success" sx={{ borderRadius: 2 }}>
                    Cache cleared successfully!
                  </Alert>
                )}
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', sm: 'flex-end' } }}>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={handleReset}
                    sx={{ borderRadius: 2, px: 3 }}
                  >
                    Reset All
                  </Button>
                  
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveAll}
                    disabled={saveStatus === "saving"}
                    sx={{ 
                      borderRadius: 2, 
                      px: 4,
                      background: `linear-gradient(45deg, ${themeColor}, ${alpha(themeColor, 0.8)})`,
                      '&:hover': {
                        background: `linear-gradient(45deg, ${alpha(themeColor, 0.9)}, ${alpha(themeColor, 0.7)})`,
                      }
                    }}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}