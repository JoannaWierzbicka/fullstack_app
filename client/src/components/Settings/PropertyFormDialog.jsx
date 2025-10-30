import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

const EMPTY_FORM = {
  name: '',
  description: '',
};

export default function PropertyFormDialog({ open, onClose, onSubmit, initialValues }) {
  const [formValues, setFormValues] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialValues) {
      setFormValues({
        name: initialValues.name ?? '',
        description: initialValues.description ?? '',
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
    if (!formValues.name.trim()) {
      setError('Name is required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        name: formValues.name.trim(),
        description: formValues.description?.trim() || null,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Unable to save property.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialValues ? 'Edit Property' : 'Add Property'}</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            label="Name"
            name="name"
            fullWidth
            required
            value={formValues.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            label="Description"
            name="description"
            fullWidth
            multiline
            minRows={3}
            value={formValues.description}
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
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
