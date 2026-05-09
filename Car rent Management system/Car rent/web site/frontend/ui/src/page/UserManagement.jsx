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
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Delete,
  Search,
  Dashboard,
  People,
  Logout,
  FilterList,
  Sort,
  Email,
  Person,
  AdminPanelSettings,
  Block,
  CheckCircle,
  Warning,
  DirectionsCar,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { alpha, styled } from "@mui/material/styles";

// Styled Components
const GlassCard = styled(Card)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: "blur(10px)",
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
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

export default function UserManagement() {
  const navigate = useNavigate();
  const location = useLocation();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4040/users/all", config);
      console.log("Users data:", res.data); // Debug log
      console.log("User roles:", res.data.userList?.map(u => u.role)); // Debug log
      setUsers(res.data.userList || []);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to fetch users", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:4040/users/delete/${id}`, config);
      fetchUsers();
      setSnackbar({ open: true, message: "User deleted successfully", severity: "success" });
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        setSnackbar({ open: true, message: "You do not have permission to delete users", severity: "error" });
      } else {
        setSnackbar({ open: true, message: "Error deleting user", severity: "error" });
      }
    }
  };

  // Case-insensitive role filtering
  const filteredUsers = users
    .filter((u) => {
      if (filter !== "all") {
        const userRole = u.role?.toLowerCase();
        const filterRole = filter.toLowerCase();
        return userRole === filterRole;
      }
      return (
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.username || "").localeCompare(b.username || "");
        case "email":
          return (a.email || "").localeCompare(b.email || "");
        case "role":
          return (a.role || "").localeCompare(b.role || "");
        default:
          return (a.username || "").localeCompare(b.username || "");
      }
    });

  // Case-insensitive role counting
  const stats = {
    total: users.length,
    admin: users.filter(u => u.role?.toLowerCase() === "admin").length,
    user: users.filter(u => u.role?.toLowerCase() === "user").length,
    active: users.length,
  };

  console.log("Stats:", stats); // Debug log

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/admin-home" },
    { text: "Vehicles", icon: <DirectionsCar />, path: "/admin/vehicles" },
    { text: "Users", icon: <People />, path: "/admin/users", active: true },
    { text: "Logout", icon: <Logout />, path: "/login" },
  ];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} thickness={4} sx={{ color: "#667eea", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading users...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* Sidebar */}
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
                User Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage {users.length} registered users
              </Typography>
            </Box>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<People />}
                title="Total Users"
                value={stats.total}
                color="#667eea"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<AdminPanelSettings />}
                title="Admins"
                value={stats.admin}
                color="#10b981"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<Person />}
                title="Regular Users"
                value={stats.user}
                color="#f59e0b"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<CheckCircle />}
                title="Active Users"
                value={stats.active}
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
                  placeholder="Search users by username, email, or role..."
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
                    <InputLabel>Filter by Role</InputLabel>
                    <Select
                      value={filter}
                      label="Filter by Role"
                      onChange={(e) => setFilter(e.target.value)}
                      startAdornment={<FilterList sx={{ mr: 1, color: "#94a3b8" }} />}
                    >
                      <MenuItem value="all">All Roles</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="user">User</MenuItem>
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
                      <MenuItem value="name">Username</MenuItem>
                      <MenuItem value="email">Email</MenuItem>
                      <MenuItem value="role">Role</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
          </GlassCard>

          {/* Users Table */}
          <GlassCard>
            <TableContainer sx={{ maxHeight: "calc(100vh - 400px)" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: 700, py: 2 }}>User</TableCell>
                    <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: 700, py: 2 }}>Email</TableCell>
                    <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: 700, py: 2 }}>Role</TableCell>
                    <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: 700, py: 2 }}>Status</TableCell>
                    <TableCell sx={{ bgcolor: "#f8fafc", fontWeight: 700, py: 2 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <TableRow
                        key={u.id}
                        hover
                        sx={{
                          "&:hover": { bgcolor: "#f8fafc" },
                          transition: "all 0.2s ease",
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar
                              sx={{
                                bgcolor: u.role?.toLowerCase() === "admin" ? "#10b981" : "#3b82f6",
                                width: 40,
                                height: 40,
                                fontSize: 16,
                                fontWeight: 600,
                              }}
                            >
                              {u.username?.charAt(0).toUpperCase() || "U"}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                                {u.username || "Unknown"}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {u.id}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Email sx={{ fontSize: 16, color: "#64748b" }} />
                            <Typography>{u.email || "No email"}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={u.role || "Unknown"}
                            size="small"
                            sx={{
                              bgcolor: u.role?.toLowerCase() === "admin" ? "#10b98120" : "#3b82f620",
                              color: u.role?.toLowerCase() === "admin" ? "#10b981" : "#3b82f6",
                              fontWeight: 600,
                              border: u.role?.toLowerCase() === "admin" ? "1px solid #10b981" : "1px solid #3b82f6",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={<CheckCircle sx={{ fontSize: 14 }} />}
                            label="Active"
                            size="small"
                            sx={{
                              bgcolor: "#10b98110",
                              color: "#10b981",
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Delete User">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(u.id)}
                              sx={{
                                color: "#ef4444",
                                "&:hover": { bgcolor: "#fee2e2" },
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Box sx={{ textAlign: "center", py: 8 }}>
                          <People sx={{ fontSize: 60, color: "#cbd5e1", mb: 2 }} />
                          <Typography color="text.secondary" gutterBottom>
                            No users found
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Try adjusting your search or filters
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </GlassCard>

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
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </motion.div>
      </Box>
    </Box>
  );
}