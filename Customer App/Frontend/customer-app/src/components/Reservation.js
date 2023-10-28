 import React, { useState } from 'react';
 
const ReservationForm = () => {

  const [dateTime, setDateTime] = useState('');

  const [numberOfPeople, setNumberOfPeople] = useState('');
 
  const handleSubmit = (e) => {

    e.preventDefault();

    // You can handle the form submission here, for example, by making an API request to create the reservation.

    console.log('Reservation Date & Time:', dateTime);

    console.log('Number of People:', numberOfPeople);

  };
 
  return (

    <div>

      <h2>Reservation Form</h2>

      <form onSubmit={handleSubmit}>

        <div>

          <label htmlFor="dateTime">Date & Time:</label>

          <input

            type="datetime-local"

            id="dateTime"

            value={dateTime}

            onChange={(e) => setDateTime(e.target.value)}

            required

          />

        </div>

        <div>

          <label htmlFor="numberOfPeople">Number of People:</label>

          <input

            type="number"

            id="numberOfPeople"

            value={numberOfPeople}

            onChange={(e) => setNumberOfPeople(e.target.value)}

            required

          />

        </div>

        <button type="submit">Reserve Table</button>

      </form>

    </div>

  );

};
 
export default ReservationForm;
