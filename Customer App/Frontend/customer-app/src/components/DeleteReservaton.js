import React, { useState, useEffect } from 'react';
 
const ReservationDelete = () => {

  const [reservations, setReservations] = useState([]);

  const [selectedReservation, setSelectedReservation] = useState(null);
 
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
 
  const handleDeleteReservation = () => {

    if (selectedReservation) {

      // Send a request to delete the selected reservation from the server.

      // You should replace this with an actual API request.

      // After successful deletion, you can update the state or take any other desired action.

      console.log(`Deleted reservation with ID: ${selectedReservation.id}`);

    }

  };
 
  return (

    <div>

      <h2>Delete Reservation</h2>

      <label>Select a reservation to delete:</label>

      <select

        value={selectedReservation ? selectedReservation.id : ''}

        onChange={(e) => {

          const reservationId = parseInt(e.target.value, 10);

          const selected = reservations.find((reservation) => reservation.id === reservationId);

          setSelectedReservation(selected);

        }}

      >

        <option value="">Select a reservation</option>

        {reservations.map((reservation) => (

          <option key={reservation.id} value={reservation.id}>

            {reservation.dateTime}

          </option>

        ))}

      </select>

      {selectedReservation && (

        <div>

          <p>Date & Time: {selectedReservation.dateTime}</p>

          <p>Number of People: {selectedReservation.numberOfPeople}</p>

          <button onClick={handleDeleteReservation}>Delete Reservation</button>

        </div>

      )}

    </div>

  );

};
 
export default ReservationDelete;
