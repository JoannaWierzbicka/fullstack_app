import { useState } from 'react';
import { useNavigate, useLoaderData } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Box,
  Paper,
  Typography
} from '@mui/material';
import { FaSave, FaTimes } from 'react-icons/fa';
import { updateReservation } from '../api/reservations';

function EditReservation() {
  const navigate = useNavigate();
  const reservation = useLoaderData();
  const [open] = useState(true);

  const [formData, setFormData] = useState({
    name: reservation.name || '',
    lastname: reservation.lastname || '',
    phone: reservation.phone || '',
    mail: reservation.mail || '',
    start_date: reservation.start_date || '',
    end_date: reservation.end_date || '',
    room: reservation.room || '',
    price: reservation.price || '',
    adults: reservation.adults || '',
    children: reservation.children || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    navigate('/dashboard');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await updateReservation(reservation.id, formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to update reservation.');
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Reservation</DialogTitle>
      <DialogContent dividers>
        {error && (
          <Typography color="error" variant="body2" mb={2}>
            {error}
          </Typography>
        )}

        <Paper elevation={0}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
          >
            <TextField
              label="First Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Last Name"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Email"
              name="mail"
              value={formData.mail}
              onChange={handleChange}
              type="email"
              required
              fullWidth
            />
            <TextField
              label="Start Date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <FormControl required fullWidth>
              <InputLabel id="room-label">Room</InputLabel>
              <Select
                labelId="room-label"
                name="room"
                value={formData.room}
                onChange={handleChange}
                label="Room"
              >
                <MenuItem value="1">Room 1</MenuItem>
                <MenuItem value="2">Room 2</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              fullWidth
            />

            <FormControl required fullWidth>
              <InputLabel id="adults-label">Adults</InputLabel>
              <Select
                labelId="adults-label"
                name="adults"
                value={formData.adults}
                onChange={handleChange}
                label="Adults"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl required fullWidth>
              <InputLabel id="children-label">Children</InputLabel>
              <Select
                labelId="children-label"
                name="children"
                value={formData.children}
                onChange={handleChange}
                label="Children"
              >
                {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <DialogActions sx={{ justifyContent: 'flex-end', mt: 2 }}>
              <Button
                onClick={handleClose}
                color="secondary"
                startIcon={<FaTimes />}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                startIcon={<FaSave />}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogActions>
          </Box>
        </Paper>
      </DialogContent>
    </Dialog>
  );
}

export default EditReservation;
