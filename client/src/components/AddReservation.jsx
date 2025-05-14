import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';
import { createReservation } from '../api/reservations';
import './AddReservation.css';

function AddReservation() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    phone: '',
    mail: '',
    start_date: '',
    end_date: '',
    room: '',
    price: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
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
      await createReservation(formData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create reservation.');
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="add-reservation-container">
      <h2>Add New Reservation</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="reservation-form">
        {['name','lastname','phone','mail','start_date','end_date','room','price'].map(field => (
          <div key={field} className="form-group">
            <label htmlFor={field}>{field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
            <input
              type={field.includes('date') ? 'date' : 'text'}
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={field.includes('date') ? undefined : `Enter ${field}`}
              required
            />
          </div>
        ))}
        <div className="form-actions">
          <button type="submit" disabled={isSubmitting} className="primary">
            <FaSave /> {isSubmitting ? 'Creating...' : 'Create Reservation'}
          </button>
          <Link to="/" className="button secondary">
            <FaTimes /> Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default AddReservation;
