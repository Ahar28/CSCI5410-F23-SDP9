import React, { useState, useEffect } from 'react';
 
const ReservationEdit = () => {

  const [reservations, setReservations] = useState([]);

  const [selectedReservation, setSelectedReservation] = useState(null);

  const [newDateTime, setNewDateTime] = useState('');

  const [newNumberOfPeople, setNewNumberOfPeople] = useState('');
 
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
 
  const handleEditReservation = () => {

    if (selectedReservation && newDateTime && newNumberOfPeople) {

      // Send a request to edit the selected reservation on the server with new data.

      // You should replace this with an actual API request.

      // After successful editing, you can update the state or take any other desired action.

      console.log(`Edited reservation with ID: ${selectedReservation.id}`);

      console.log(`New Date & Time: ${newDateTime}`);

      console.log(`New Number of People: ${newNumberOfPeople}`);

    }

  };
 
  return (

    <div>

      <h2>Edit Reservation</h2>

      <label>Select a reservation to edit:</label>

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

          <label>New Date & Time:</label>

          <input

            type="datetime-local"

            value={newDateTime}

            onChange={(e) => setNewDateTime(e.target.value)}

          />

          <label>New Number of People:</label>

          <input

            type="number"

            value={newNumberOfPeople}

            onChange={(e) => setNewNumberOfPeople(e.target.value)}

          />

          <button onClick={handleEditReservation}>Edit Reservation</button>

        </div>

      )}

    </div>

  );

};
 
export default ReservationEdit;
