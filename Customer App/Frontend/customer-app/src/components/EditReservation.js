/**
 * edit reservtion
 * send the data from the card to fill in the form and then upon clicking should hit the udpate api
 */

import React, { useState, useEffect } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

const EditReservationForm = () => {
  const { restaurant_id } = useParams();
  //const reservationDate = restaurant_id;
  const [user_id, setUserID] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [no_of_people, setNumberOfPeople] = useState("");
  const [reservationData, setReservationData] = useState(null);
  const parsedNoOfPeople = parseInt(no_of_people, 10);
  const parsedRestaurantId = parseInt(restaurant_id, 10);

  useEffect(() => {
    const user_id = sessionStorage.getItem("userId");
    setUserID(user_id);
  });

  // const {
  //   state: { restaurantData },
  // } = useLocation();

  // console.log("====+++++=====", restaurantData);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleChange = (e, key) => {
    if (key === "no_of_people") {
      setNumberOfPeople(e.target.value);
    } else if (key === "date") {
      setDate(e.target.value);
    }
    if (key === "time") {
      setTime(e.target.value);
    }
  };

  /**
   * handle update request here
   */

  const handleReservation = async () => {
    var response;
    try {
      const datetime = `${date} ${time}`;
      // Make an API POST request to create a reservation

      response = await axios.post(
        //"https://nhmbrue00f.execute-api.us-east-1.amazonaws.com/dev/create-restaurant-reservation",
        "https://xt9cbpo2ye.execute-api.us-east-1.amazonaws.com/dev/createreservation",
        //"https://y63heby3kj.execute-api.us-east-1.amazonaws.com/dev/createresrevation",
        {
          no_of_people: parsedNoOfPeople,
          reservationDate: datetime,
          user_id,
          restaurant_id: parsedRestaurantId,
        }
      );

      // Handle a successful reservation
      //setReservationData(response.data);

      // navigate("/home");
    } catch (error) {
      console.log(response);
      // Handle  errors, e.g., display an error message to the user
      console.error("Error creating reservation: ", error);
      setReservationData(null);
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Edit your Reservation</h2>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Row>
              <Form.Label>Restaurant ID is : {restaurant_id} </Form.Label>
            </Row>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>No of People</Form.Label>
              <Form.Control
                type="number"
                placeholder="party size "
                value={no_of_people}
                onChange={(e) => handleChange(e, "no_of_people")}
                min={1}
                max={20}
              />
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => handleChange(e, "date")}
              />
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                value={time}
                step="1"
                onChange={(e) => handleChange(e, "time")}
              />
            </Form.Group>
          </Row>
          <Button
            variant="primary"
            type="submit"
            style={{ marginTop: "20px" }}
            onClick={() => handleReservation()}
          >
            Confirm Changes
          </Button>
        </Form>

        {reservationData && (
          <div>
            <p>Reservation Changes made successfully!</p>
            <pre>{JSON.stringify(reservationData, null, 2)}</pre>
          </div>
        )}
      </Container>
    </div>
  );
};

export default EditReservationForm;
