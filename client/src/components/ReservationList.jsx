import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './ReservationList.css';

function ReservationList() {
  const initialReservations = useLoaderData();
  const [reservations, setReservations] = useState(initialReservations);
  const navigate = useNavigate();

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Delete this reservation?')) {
      await fetch(`/api/reservations/${id}`, { method: 'DELETE' });
      setReservations(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <div className="reservation-list-container">
      <h2>Reservations</h2>

      {reservations.length === 0 ? (
        <div className="empty-state">
          <p>No reservations found.</p>
          <Link to="/add" className="button">
            <FaEdit /> Add Your First Reservation
          </Link>
        </div>
      ) : (
        <ul className="reservation-list">
          {reservations.map(reservation => (
            <li
              key={reservation.id}
              className="reservation-item"
              onClick={() => navigate(`/detail/${reservation.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="reservation-details">
                <h3>{reservation.name} {reservation.lastname}</h3>
                <p>Room: {reservation.room} | Price: ${reservation.price}</p>
                <p>From: {reservation.start_date} To: {reservation.end_date}</p>
                <p>Contact: {reservation.mail} | {reservation.phone}</p>
              </div>
              <div className="reservation-actions">
                <Link
                  to={`/edit/${reservation.id}`}
                  className="button"
                  onClick={e => e.stopPropagation()}
                >
                  <FaEdit /> Edit
                </Link>
                <button
                  className="button delete"
                  onClick={e => handleDelete(e, reservation.id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReservationList;
