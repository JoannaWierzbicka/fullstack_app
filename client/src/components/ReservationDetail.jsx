import { useLoaderData, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { FaSave, FaTrashAlt, FaTimes } from 'react-icons/fa';
import { updateReservation, deleteReservation } from '../api/reservations';
import './ReservationDetail.css';

function ReservationDetail() {
  const reservation = useLoaderData();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: reservation.name,
    lastname: reservation.lastname,
    phone: reservation.phone,
    mail: reservation.mail,
    start_date: reservation.start_date,
    end_date: reservation.end_date,
    room: reservation.room,
    price: reservation.price
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
      await updateReservation(reservation.id, formData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to save.');
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      setIsSubmitting(true);
      try {
        await deleteReservation(reservation.id);
        navigate('/');
      } catch (err) {
        setError(err.message || 'Failed to delete.');
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <div className="reservation-detail-container">
      <h2>Edit Reservation</h2>
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
              required
            />
          </div>
        ))}
        <div className="form-actions">
          <button type="submit" disabled={isSubmitting} className="primary">
            <FaSave /> {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <Link to="/" className="button secondary">
            <FaTimes /> Cancel
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isSubmitting}
            className="danger"
          >
            <FaTrashAlt /> {isSubmitting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReservationDetail;
