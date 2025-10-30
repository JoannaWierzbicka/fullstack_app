import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { FaSave, FaTimes } from 'react-icons/fa';

const DEFAULT_FORM_VALUES = {
  name: '',
  lastname: '',
  phone: '',
  mail: '',
  start_date: '',
  end_date: '',
  property_id: '',
  room_id: '',
  price: '',
  adults: '',
  children: '',
};

const ADULT_OPTIONS = Array.from({ length: 6 }, (_, index) => String(index + 1));
const CHILDREN_OPTIONS = Array.from({ length: 7 }, (_, index) => String(index));

const toFormValues = (values = {}) => ({
  ...DEFAULT_FORM_VALUES,
  ...Object.entries(values).reduce((acc, [key, value]) => {
    if (value === null || value === undefined) return acc;
    if (['adults', 'children', 'price'].includes(key)) {
      acc[key] = String(value);
    } else if (['room_id', 'property_id'].includes(key)) {
      acc[key] = String(value);
    } else {
      acc[key] = value;
    }
    return acc;
  }, {}),
});

const toPayload = (values) => ({
  name: values.name.trim(),
  lastname: values.lastname.trim(),
  phone: values.phone.trim(),
  mail: values.mail.trim(),
  start_date: values.start_date,
  end_date: values.end_date,
  property_id: values.property_id || null,
  room_id: values.room_id || null,
  price: values.price ? Number(values.price) : null,
  adults: values.adults ? Number(values.adults) : null,
  children: values.children ? Number(values.children) : null,
});

const validateForm = (values) => {
  if (!values.name.trim()) return 'First name is required.';
  if (!values.lastname.trim()) return 'Last name is required.';
  if (!values.phone.trim()) return 'Phone is required.';
  if (!values.mail.trim()) return 'Email is required.';
  if (!values.start_date) return 'Start date is required.';
  if (!values.end_date) return 'End date is required.';
  if (!values.property_id) return 'Property is required.';
  if (!values.room_id) return 'Room is required.';
  if (!values.price) return 'Price is required.';
  if (!values.adults) return 'Number of adults is required.';
  if (values.start_date && values.end_date) {
    const start = new Date(values.start_date);
    const end = new Date(values.end_date);
    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end <= start) {
      return 'End date must be after the start date.';
    }
  }
  return null;
};

function ReservationFormDialog({
  title,
  initialValues,
  submitLabel,
  submittingLabel,
  onSubmit,
  onCancel,
  properties,
  rooms,
  onPropertyChange,
  loadingProperties = false,
  loadingRooms = false,
  dataError,
  minDate,
}) {
  const [formValues, setFormValues] = useState(() => toFormValues(initialValues));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => () => {
    isMountedRef.current = false;
  }, []);

  useEffect(() => {
    setFormValues(toFormValues(initialValues));
  }, [initialValues]);

  useEffect(() => {
    if (!rooms || rooms.length === 0) return;
    setFormValues((prev) => {
      if (prev.room_id && rooms.some((room) => room.id === prev.room_id)) {
        return prev;
      }
      return {
        ...prev,
        room_id: rooms[0].id,
      };
    });
  }, [rooms]);

  const disableSubmit = useMemo(() => {
    return (
      !formValues.name ||
      !formValues.lastname ||
      !formValues.mail ||
      !formValues.start_date ||
      !formValues.end_date ||
      !formValues.property_id ||
      !formValues.room_id
    );
  }, [formValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateForm(formValues);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(toPayload(formValues));
    } catch (submissionError) {
      setError(
        submissionError?.message || 'We were unable to save the reservation. Please try again.',
      );
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog open onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {dataError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {dataError}
          </Alert>
        )}

        {(properties?.length === 0 && !loadingProperties) && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Add a property first in Settings to create reservations.
          </Alert>
        )}

        {error && (
          <Typography color="error" variant="body2" mb={2}>
            {error}
          </Typography>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
        >
          <TextField
            label="First Name"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Last Name"
            name="lastname"
            value={formValues.lastname}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Phone"
            name="phone"
            value={formValues.phone}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Email"
            name="mail"
            type="email"
            value={formValues.mail}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="Start Date"
            name="start_date"
            type="date"
            value={formValues.start_date}
            onChange={handleChange}
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: minDate }}
          />

          <TextField
            label="End Date"
            name="end_date"
            type="date"
            value={formValues.end_date}
            onChange={handleChange}
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: formValues.start_date || minDate }}
          />

          <FormControl required fullWidth disabled={loadingProperties || (properties?.length ?? 0) === 0}>
            <InputLabel id="property-label">Property</InputLabel>
            <Select
              labelId="property-label"
              name="property_id"
              value={formValues.property_id}
              label="Property"
              onChange={(event) => {
                handleChange(event);
                onPropertyChange?.(event.target.value);
                setFormValues((prev) => ({
                  ...prev,
                  room_id: '',
                }));
              }}
            >
              {properties?.map((property) => (
                <MenuItem key={property.id} value={property.id}>
                  {property.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl required fullWidth>
            <InputLabel id="room-label">Room</InputLabel>
            <Select
              labelId="room-label"
              name="room_id"
              value={formValues.room_id}
              onChange={handleChange}
              label="Room"
              disabled={!formValues.property_id || loadingRooms || !rooms?.length}
            >
              {rooms?.map((room) => (
                <MenuItem key={room.id} value={room.id}>
                  {room.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Price (PLN)"
            name="price"
            type="number"
            value={formValues.price}
            onChange={handleChange}
            required
            fullWidth
            inputProps={{ min: 0 }}
          />

          <FormControl required fullWidth>
            <InputLabel id="adults-label">Adults</InputLabel>
            <Select
              labelId="adults-label"
              name="adults"
              value={formValues.adults}
              onChange={handleChange}
              label="Adults"
            >
              {ADULT_OPTIONS.map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl required fullWidth>
            <InputLabel id="children-label">Children</InputLabel>
            <Select
              labelId="children-label"
              name="children"
              value={formValues.children}
              onChange={handleChange}
              label="Children"
            >
              {CHILDREN_OPTIONS.map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <DialogActions sx={{ justifyContent: 'flex-end', mt: 2 }}>
            <Button
              onClick={onCancel}
              color="secondary"
              startIcon={<FaTimes />}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting || disableSubmit}
              startIcon={<FaSave />}
            >
              {isSubmitting ? submittingLabel : submitLabel}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default ReservationFormDialog;
