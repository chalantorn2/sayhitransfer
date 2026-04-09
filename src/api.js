const API = '/api';

export async function fetchLocations() {
  const res = await fetch(`${API}/locations.php`);
  if (!res.ok) throw new Error('Failed to fetch locations');
  return res.json();
}

export async function fetchVehicles(pickupId, dropoffId) {
  const params = new URLSearchParams();
  if (pickupId) params.set('pickup', pickupId);
  if (dropoffId) params.set('dropoff', dropoffId);
  const qs = params.toString();
  const res = await fetch(`${API}/vehicles.php${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch vehicles');
  return res.json();
}

export async function fetchTours() {
  const res = await fetch(`${API}/tours.php`);
  if (!res.ok) throw new Error('Failed to fetch tours');
  return res.json();
}

export async function fetchTour(id) {
  const res = await fetch(`${API}/tours.php?id=${id}`);
  if (!res.ok) throw new Error('Tour not found');
  return res.json();
}

export async function createBooking(data) {
  const res = await fetch(`${API}/bookings.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Booking failed');
  return json;
}
