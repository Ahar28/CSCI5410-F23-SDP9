import React, { useState, useEffect } from 'react';
 
const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
 
  // Simulated reservation data, you should replace this with data from your API.
  const dummyReservations = [
    { id: 1, dateTime: '2023-10-28T19:00', numberOfPeople: 4 },
    { id: 2, dateTime: '2023-11-05T18:30', numberOfPeople: 2 },
    { id: 3, dateTime: '2023-11-12T20:15', numberOfPeople: 6 },
  ];
 
  // Simulate fetching reservations from an API.
  useEffect(() => {
    // Replace this with an actual API call to fetch user reservations.
    // For now, we use dummy data.
    setReservations(dummyReservations);
  }, []);
 
  return (
<div>
<h2>Your Reservations</h2>
<ul>
        {reservations.map((reservation) => (
<li key={reservation.id}>
<p>Date & Time: {reservation.dateTime}</p>
<p>Number of People: {reservation.numberOfPeople}</p>
</li>
        ))}
</ul>
</div>
  );
};
 
export default ReservationList;