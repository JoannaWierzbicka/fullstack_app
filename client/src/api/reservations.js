const API_BASE = '/api';

export async function loadReservations() {
    try {
      const endpoint = `${API_BASE}/reservations`;
  
      console.log('Fetching reservations from:', endpoint);
      const response = await fetch(endpoint);
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(errorData.error || `Failed to fetch reservations: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Reservations fetched:', data);
      return data;
    } catch (error) {
      console.error('Error loading reservations:', error);
      return [];
    }
  }

export async function loadReservation(lastname) {
  try {
    const response = await fetch(`${API_BASE}/reservations/${lastname}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch reservation with lastname: ${lastname}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading reservation for ${lastname}:`, error);
   
    return { id, name: 'Error loading reservation', lastname: ''};
  }
}

// Create a new task
export async function createReservation(reservationData) {
  const response = await fetch(`${API_BASE}/reservations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reservationData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create reservation');
  }
  return await response.json();
}

// Update an existing task
export async function updateReservation(id, reservationData) {
  const response = await fetch(`${API_BASE}/reservations/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reservationData),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update reservation with ID: ${id}`);
  }
  return await response.json();
}

// Delete a task
export async function deleteReservation(id) {
  const response = await fetch(`${API_BASE}/reservations/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete reservation with ID ${id}`);
  }
  return await response.json();
} 