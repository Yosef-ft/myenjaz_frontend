import React, { useState, useEffect, ChangeEvent } from 'react';
import { AxiosError } from 'axios';
import axios from "../../Api/axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  createTheme,
  ThemeProvider,
} from '@mui/material';

// Create a custom theme with our red color
const theme = createTheme({
  palette: {
    primary: {
      main: '#E6534E',
    },
  },
});

interface SubAdmin {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone_no: string;
  role: string;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NewSubAdminData {
  username: string;
  email: string;
  password: string;
  full_name: string;
  phone_no: string;
}

const Settings: React.FC = () => {
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
  const [openNewSubAdmin, setOpenNewSubAdmin] = useState(false);
  const [openPasswordChange, setOpenPasswordChange] = useState(false);
  const [newSubAdmin, setNewSubAdmin] = useState<NewSubAdminData>({
    username: '',
    email: '',
    password: '',
    full_name: '',
    phone_no: '',
  });
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchSubAdmins();
  }, []);

  const fetchSubAdmins = async () => {
    try {
      const response = await axios.get('/admin/admins');
      setSubAdmins(response.data.filter((admin: SubAdmin) => admin.role === 'sub admin'));
    } catch (error) {
      const axiosError = error as AxiosError;
      showSnackbar(axiosError.message || 'Failed to fetch sub-admins', 'error');
    }
  };

  const handleAddSubAdmin = async () => {
    try {
      await axios.post('/admin/register', {
        ...newSubAdmin,
        role: 'sub admin',
      });
      showSnackbar('Sub-admin added successfully', 'success');
      setOpenNewSubAdmin(false);
      setNewSubAdmin({
        username: '',
        email: '',
        password: '',
        full_name: '',
        phone_no: '',
      });
      fetchSubAdmins();
    } catch (error) {
      const axiosError = error as AxiosError;
      showSnackbar(axiosError.message || 'Failed to add sub-admin', 'error');
    }
  };

  const handleDeleteSubAdmin = async (id: number) => {
    try {
        await axios.delete(`/admin/delete/${id}`);
      showSnackbar('Sub-admin deleted successfully', 'success');
      fetchSubAdmins();
    } catch (error) {
      const axiosError = error as AxiosError;
      showSnackbar(axiosError.message || 'Failed to delete sub-admin', 'error');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showSnackbar('New passwords do not match', 'error');
      return;
    }

    try {
      await axios.post('/admin/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      showSnackbar('Password changed successfully', 'success');
      setOpenPasswordChange(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      showSnackbar(axiosError.message || 'Failed to change password', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>

        {/* Password Change Section */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Change Password
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenPasswordChange(true)}
            sx={{ '&:hover': { backgroundColor: '#b91c1c' } }}
          >
            Change Password
          </Button>
        </Paper>

        {/* Sub-Admins Management Section */}
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Sub-Admins Management</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenNewSubAdmin(true)}
              sx={{ '&:hover': { backgroundColor: '#b91c1c' } }}
            >
              Add New Sub-Admin
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subAdmins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>{admin.username}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{admin.full_name}</TableCell>
                    <TableCell>{admin.phone_no}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteSubAdmin(admin.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* New Sub-Admin Dialog */}
        <Dialog open={openNewSubAdmin} onClose={() => setOpenNewSubAdmin(false)}>
          <DialogTitle>Add New Sub-Admin</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              value={newSubAdmin.username}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewSubAdmin({ ...newSubAdmin, username: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              value={newSubAdmin.email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewSubAdmin({ ...newSubAdmin, email: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={newSubAdmin.password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewSubAdmin({ ...newSubAdmin, password: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="Full Name"
              margin="normal"
              value={newSubAdmin.full_name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewSubAdmin({ ...newSubAdmin, full_name: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="Phone Number"
              margin="normal"
              value={newSubAdmin.phone_no}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewSubAdmin({ ...newSubAdmin, phone_no: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenNewSubAdmin(false)}>Cancel</Button>
            <Button onClick={handleAddSubAdmin} variant="contained" color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>

        {/* Password Change Dialog */}
        <Dialog open={openPasswordChange} onClose={() => setOpenPasswordChange(false)}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              margin="normal"
              value={passwordData.currentPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              margin="normal"
              value={passwordData.newPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              margin="normal"
              value={passwordData.confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPasswordChange(false)}>Cancel</Button>
            <Button
              onClick={handleChangePassword}
              variant="contained"
              color="primary"
            >
              Change Password
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default Settings; 