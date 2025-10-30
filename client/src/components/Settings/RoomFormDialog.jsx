import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';

const EMPTY_FORM = {
  property_id: '',
  name: '',
};

export default function RoomFormDialog({
  open,
  onClose,
  onSubmit,
  initialValues,
  properties,
}) {
  const [formValues, setFormValues] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialValues) {
      setFormValues({
        property_id: initialValues.property_id ?? '',
        name: initialValues.name ?? '',
      });
    } else {
      setFormValues(EMPTY_FORM);
    }
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formValues.property_id) {
      setError('Property is required.');
      return;
    }
    if (!formValues.name.trim()) {
      setError('Room name is required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        property_id: formValues.property_id,
        name: formValues.name.trim(),
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Unable to save room.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialValues ? 'Edit Room' : 'Add Room'}</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="room-property-label">Property</InputLabel>
            <Select
              labelId="room-property-label"
              name="property_id"
              value={formValues.property_id}
              label="Property"
              onChange={handleChange}
              disabled={Boolean(initialValues)}
            >
              {properties.map((property) => (
                <MenuItem key={property.id} value={property.id}>
                  {property.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="normal"
            label="Room name / number"
            name="name"
            fullWidth
            required
            value={formValues.name}
            onChange={handleChange}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting || properties.length === 0}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
