import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
  Chip,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Badge,
  LinearProgress,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Search,
  Visibility,
  Dashboard,
  DirectionsCar,
  People,
  Logout,
  FilterList,
  Sort,
  Star,
  LocalGasStation,
  Group,
  AttachMoney,
  Description,
  PhotoCamera,
  Close,
  CheckCircle,
  Speed,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { alpha, styled } from "@mui/material/styles";

// Styled Components
const GlassCard = styled(Card)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: "blur(10px)",
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  fontWeight: 600,
  "&:hover": {
    background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
  },
  transition: "all 0.3s ease",
}));

const SearchField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    backgroundColor: alpha(theme.palette.background.paper, 0.9),
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: alpha(theme.palette.background.paper, 1),
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
    },
    "&.Mui-focused": {
      backgroundColor: "white",
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
    },
  },
}));

// Helper to render stars
const renderStars = (rating) => {
  const filled = Math.floor(rating || 0);
  const half = (rating || 0) - filled >= 0.5 ? 1 : 0;
  const empty = 5 - filled - half;
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      {"★".repeat(filled)}
      {half ? "½" : ""}
      {"☆".repeat(empty)}
      <Typography variant="caption" sx={{ ml: 1, color: "text.secondary" }}>
        ({rating || 0}/5)
      </Typography>
    </Box>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <GlassCard sx={{ p: 2 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Box
        sx={{
          p: 1.5,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${color}20 0%, ${color}40 100%)`,
          color: color,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  </GlassCard>
);

export default function VehicleManagement() {
  const navigate = useNavigate();
  const location = useLocation();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [searchTerm, setSearchTerm] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  const [formData, setFormData] = useState({
    vehicleCategory: "",
    fuelType: "",
    vehicleCapacity: "",
    vehiclePrice: "",
    vehicleDescription: "",
    photo: null,
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const [showVehicle, setShowVehicle] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4040/cars/all", config);
      setVehicles(res.data.carList || []);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Error fetching vehicles", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await axios.delete(`http://localhost:4040/cars/delete/${id}`, config);
      fetchVehicles();
      setSnackbar({ open: true, message: "Vehicle deleted successfully", severity: "success" });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Error deleting vehicle", severity: "error" });
    }
  };

  const handleOpenForm = (vehicle = null) => {
    setEditVehicle(vehicle);
    if (vehicle) {
      setFormData({
        vehicleCategory: vehicle.vehicleCategory || "",
        fuelType: vehicle.fuelType || "",
        vehicleCapacity: vehicle.vehicleCapacity || "",
        vehiclePrice: vehicle.vehiclePrice || "",
        vehicleDescription: vehicle.vehicleDescription || "",
        photo: null,
      });
    } else {
      setFormData({
        vehicleCategory: "",
        fuelType: "",
        vehicleCapacity: "",
        vehiclePrice: "",
        vehicleDescription: "",
        photo: null,
      });
    }
    setShowForm(true);
  };
  
  const handleCloseForm = () => {
    setShowForm(false);
    setEditVehicle(null);
  };

  const handleShowVehicle = (vehicle) => setShowVehicle(vehicle);
  const handleCloseShow = () => setShowVehicle(null);

  const handleChange = (e) => {
    if (e.target.name === "photo") setFormData({ ...formData, photo: e.target.files[0] });
    else setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) data.append(key, formData[key]);
      });

      if (editVehicle) {
        await axios.put(`http://localhost:4040/cars/update/${editVehicle.id}`, data, config);
        setSnackbar({ open: true, message: "Vehicle updated successfully", severity: "success" });
      } else {
        await axios.post("http://localhost:4040/cars/add", data, config);
        setSnackbar({ open: true, message: "Vehicle added successfully", severity: "success" });
      }

      fetchVehicles();
      handleCloseForm();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Error saving vehicle", severity: "error" });
    } finally {
      setSubmitLoading(false);
    }
  };

  const filteredVehicles = vehicles
    .filter((v) => {
      if (filter !== "all" && v.fuelType !== filter) return false;
      return (
        v.vehicleCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.fuelType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.vehicleDescription?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return b.vehiclePrice - a.vehiclePrice;
        case "rating":
          return (b.vehicleRating || 0) - (a.vehicleRating || 0);
        default:
          return a.vehicleCategory.localeCompare(b.vehicleCategory);
      }
    });

  const stats = {
    total: vehicles.length,
    electric: vehicles.filter(v => v.fuelType?.toLowerCase().includes("electric")).length,
    premium: vehicles.filter(v => parseFloat(v.vehiclePrice) > 100).length,
    averagePrice: vehicles.length > 0 
      ? (vehicles.reduce((sum, v) => sum + parseFloat(v.vehiclePrice || 0), 0) / vehicles.length).toFixed(2)
      : 0,
  };

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/admin-home" },
    { text: "Vehicles", icon: <DirectionsCar />, path: "/admin/vehicles", active: true },
    { text: "Users", icon: <People />, path: "/userManagement" },
    { text: "Logout", icon: <Logout />, path: "/login" },
  ];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} thickness={4} sx={{ color: "#667eea", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading vehicles...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* Enhanced Sidebar */}
      <Box
        sx={{
          width: 280,
          bgcolor: "white",
          borderRight: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          boxShadow: "4px 0 20px rgba(0, 0, 0, 0.03)",
          position: "fixed",
          height: "100vh",
          zIndex: 1000,
        }}
      >
        <Box sx={{ p: 3, pb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 40,
                height: 40,
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              C
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
                PremiumRentals
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 500 }}>
                Admin Panel
              </Typography>
            </Box>
          </Box>

          <List sx={{ flex: 1 }}>
            {menuItems.map((item, index) => (
              <ListItemButton
                key={index}
                onClick={() => navigate(item.path)}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  color: item.active ? "#667eea" : "#64748b",
                  bgcolor: item.active ? "#667eea10" : "transparent",
                  "&:hover": {
                    bgcolor: item.active ? "#667eea20" : "#f1f5f9",
                    transform: "translateX(4px)",
                  },
                  transition: "all 0.2s ease",
                  fontWeight: item.active ? 600 : 500,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "inherit",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "0.95rem",
                    fontWeight: "inherit",
                  }}
                />
                {item.active && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "#667eea",
                      ml: 1,
                    }}
                  />
                )}
              </ListItemButton>
            ))}
          </List>
        </Box>

        <Box sx={{ p: 3, pt: 2, borderTop: "1px solid #f1f5f9", mt: "auto" }}>
          <Box sx={{ textAlign: "center" }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                mx: "auto",
                mb: 2,
                bgcolor: "primary.main",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              A
            </Avatar>
            <Typography sx={{ fontWeight: 600, color: "#1e293b", mb: 0.5 }}>
              Admin User
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#64748b" }}>
              Administrator
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, ml: "280px", p: 3 }}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b", mb: 0.5 }}>
                Vehicle Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your fleet of {vehicles.length} vehicles
              </Typography>
            </Box>
            <GradientButton
              startIcon={<Add />}
              onClick={() => handleOpenForm()}
              sx={{ px: 3, py: 1 }}
            >
              Add New Vehicle
            </GradientButton>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<DirectionsCar />}
                title="Total Vehicles"
                value={stats.total}
                color="#667eea"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<LocalGasStation />}
                title="Electric"
                value={stats.electric}
                color="#10b981"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<AttachMoney />}
                title="Average Price"
                value={`$${stats.averagePrice}`}
                color="#f59e0b"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<Star />}
                title="Premium"
                value={stats.premium}
                color="#ef4444"
              />
            </Grid>
          </Grid>

          {/* Controls */}
          <GlassCard sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <SearchField
                  fullWidth
                  placeholder="Search vehicles by category, fuel type, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: "#94a3b8" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Filter by Fuel</InputLabel>
                    <Select
                      value={filter}
                      label="Filter by Fuel"
                      onChange={(e) => setFilter(e.target.value)}
                      startAdornment={<FilterList sx={{ mr: 1, color: "#94a3b8" }} />}
                    >
                      <MenuItem value="all">All Types</MenuItem>
                      <MenuItem value="Electric">Electric</MenuItem>
                      <MenuItem value="Petrol">Petrol</MenuItem>
                      <MenuItem value="Diesel">Diesel</MenuItem>
                      <MenuItem value="Hybrid">Hybrid</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth size="small">
                    <InputLabel>Sort by</InputLabel>
                    <Select
                      value={sortBy}
                      label="Sort by"
                      onChange={(e) => setSortBy(e.target.value)}
                      startAdornment={<Sort sx={{ mr: 1, color: "#94a3b8" }} />}
                    >
                      <MenuItem value="name">Name</MenuItem>
                      <MenuItem value="price">Price (High to Low)</MenuItem>
                      <MenuItem value="rating">Rating</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
          </GlassCard>

          {/* Vehicles Table */}
          <GlassCard>
            <TableContainer sx={{ maxHeight: "calc(100vh - 400px)" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: 700, py: 2 }}>Vehicle</TableCell>
                    <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: 700, py: 2 }}>Category</TableCell>
                    <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: 700, py: 2 }}>Fuel Type</TableCell>
                    <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: 700, py: 2 }}>Capacity</TableCell>
                    <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: 700, py: 2 }}>Price</TableCell>
                    <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: 700, py: 2 }}>Rating</TableCell>
                    <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: 700, py: 2 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredVehicles.length > 0 ? (
                    filteredVehicles.map((v) => (
                      <TableRow
                        key={v.id}
                        hover
                        sx={{
                          "&:hover": { bgcolor: "#f8fafc" },
                          transition: "all 0.2s ease",
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar
                              src={v.vehiclePhotoURL}
                              variant="rounded"
                              sx={{
                                width: 60,
                                height: 40,
                                borderRadius: 1.5,
                                boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                              }}
                            >
                              <DirectionsCar />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                                {v.vehicleCategory}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {v.id}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={v.vehicleCategory}
                            size="small"
                            sx={{
                              bgcolor: "#e0f2fe",
                              color: "#0369a1",
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={<LocalGasStation sx={{ fontSize: 14 }} />}
                            label={v.fuelType}
                            size="small"
                            variant="outlined"
                            sx={{ borderColor: "#cbd5e1", color: "#475569" }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Group sx={{ fontSize: 16, color: "#64748b" }} />
                            <Typography>{v.vehicleCapacity}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontWeight: 700, color: "#1e293b" }}>
                            ${v.vehiclePrice}
                            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                              /day
                            </Typography>
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {renderStars(v.vehicleRating)}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 0.5 }}>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => handleShowVehicle(v)}
                                sx={{
                                  color: "#3b82f6",
                                  "&:hover": { bgcolor: "#dbeafe" },
                                }}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Vehicle">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenForm(v)}
                                sx={{
                                  color: "#10b981",
                                  "&:hover": { bgcolor: "#d1fae5" },
                                }}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Vehicle">
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(v.id)}
                                sx={{
                                  color: "#ef4444",
                                  "&:hover": { bgcolor: "#fee2e2" },
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Box sx={{ textAlign: "center", py: 8 }}>
                          <DirectionsCar sx={{ fontSize: 60, color: "#cbd5e1", mb: 2 }} />
                          <Typography color="text.secondary" gutterBottom>
                            No vehicles found
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Try adjusting your search or add a new vehicle
                          </Typography>
                          <Button
                            variant="outlined"
                            startIcon={<Add />}
                            onClick={() => handleOpenForm()}
                          >
                            Add Vehicle
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </GlassCard>

          {/* Add/Edit Vehicle Dialog */}
          <Dialog
            open={showForm}
            onClose={handleCloseForm}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                overflow: "hidden",
                bgcolor: "background.paper",
              },
            }}
          >
            <DialogTitle sx={{ bgcolor: "primary.main", color: "white", p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "white", color: "primary.main" }}>
                  {editVehicle ? <Edit /> : <Add />}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {editVehicle ? "Update Vehicle" : "Add New Vehicle"}
                  </Typography>
                  <Typography variant="caption">
                    {editVehicle ? "Update vehicle details" : "Add a new vehicle to your fleet"}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Vehicle Category"
                    name="vehicleCategory"
                    value={formData.vehicleCategory}
                    onChange={handleChange}
                    placeholder="e.g., SUV, Sedan, Hatchback"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DirectionsCar />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Fuel Type"
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleChange}
                    placeholder="e.g., Petrol, Diesel, Electric"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocalGasStation />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Capacity"
                    name="vehicleCapacity"
                    value={formData.vehicleCapacity}
                    onChange={handleChange}
                    placeholder="Number of seats"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Group />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Price per Day"
                    name="vehiclePrice"
                    value={formData.vehiclePrice}
                    onChange={handleChange}
                    placeholder="e.g., 49.99"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    component="label"
                    startIcon={<PhotoCamera />}
                    sx={{ height: "56px" }}
                  >
                    Upload Photo
                    <input
                      hidden
                      type="file"
                      name="photo"
                      onChange={handleChange}
                      accept="image/*"
                    />
                  </Button>
                  {formData.photo && (
                    <Typography variant="caption" color="success.main" sx={{ mt: 1, display: "block" }}>
                      <CheckCircle sx={{ fontSize: 12, mr: 0.5 }} />
                      {formData.photo.name}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="vehicleDescription"
                    value={formData.vehicleDescription}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    placeholder="Describe the vehicle features and specifications..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1 }}>
                          <Description />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: "1px solid #f1f5f9" }}>
              <Button onClick={handleCloseForm} color="inherit">
                Cancel
              </Button>
              <GradientButton
                onClick={handleSubmit}
                disabled={submitLoading}
                startIcon={submitLoading ? null : editVehicle ? <Edit /> : <Add />}
              >
                {submitLoading ? (
                  <>
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    {editVehicle ? "Updating..." : "Adding..."}
                  </>
                ) : editVehicle ? (
                  "Update Vehicle"
                ) : (
                  "Add Vehicle"
                )}
              </GradientButton>
            </DialogActions>
          </Dialog>

          {/* Vehicle Details Dialog */}
          <Dialog
            open={!!showVehicle}
            onClose={handleCloseShow}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                overflow: "hidden",
              },
            }}
          >
            {showVehicle && (
              <>
                <Box
                  sx={{
                    height: 200,
                    bgcolor: "primary.main",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Avatar
                    src={showVehicle.vehiclePhotoURL}
                    variant="rounded"
                    sx={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 0,
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    onClick={handleCloseShow}
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      bgcolor: "rgba(255,255,255,0.9)",
                      "&:hover": { bgcolor: "white" },
                    }}
                  >
                    <Close />
                  </IconButton>
                </Box>
                <DialogContent sx={{ p: 4 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b", mb: 1 }}>
                        {showVehicle.vehicleCategory}
                      </Typography>
                      <Typography color="text.secondary">
                        Vehicle ID: {showVehicle.id}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: "#e0f2fe", color: "#0369a1" }}>
                          <LocalGasStation />
                        </Avatar>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Fuel Type
                          </Typography>
                          <Typography sx={{ fontWeight: 600 }}>
                            {showVehicle.fuelType}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: "#f0f9ff", color: "#0ea5e9" }}>
                          <Group />
                        </Avatar>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Capacity
                          </Typography>
                          <Typography sx={{ fontWeight: 600 }}>
                            {showVehicle.vehicleCapacity} seats
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: "#fef3c7", color: "#d97706" }}>
                          <AttachMoney />
                        </Avatar>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Daily Price
                          </Typography>
                          <Typography sx={{ fontWeight: 600, color: "#1e293b" }}>
                            ${showVehicle.vehiclePrice}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: "#fce7f3", color: "#db2777" }}>
                          <Star />
                        </Avatar>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Rating
                          </Typography>
                          <Typography sx={{ fontWeight: 600, color: "#f59e0b" }}>
                            {renderStars(showVehicle.vehicleRating)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Description
                        </Typography>
                        <Card variant="outlined" sx={{ p: 2, bgcolor: "#f8fafc" }}>
                          <Typography>
                            {showVehicle.vehicleDescription}
                          </Typography>
                        </Card>
                      </Box>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3, borderTop: "1px solid #f1f5f9" }}>
                  <Button onClick={handleCloseShow} color="inherit">
                    Close
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => {
                      handleCloseShow();
                      handleOpenForm(showVehicle);
                    }}
                  >
                    Edit Vehicle
                  </Button>
                </DialogActions>
              </>
            )}
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
              sx={{
                borderRadius: 2,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                alignItems: "center",
              }}
              iconMapping={{
                success: <CheckCircle fontSize="inherit" />,
                error: <Close fontSize="inherit" />,
              }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </motion.div>
      </Box>
    </Box>
  );
}