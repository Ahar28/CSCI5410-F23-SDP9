import React, { useState, useEffect } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

const ReservationForm = () => {
  //const { restaurant_id } = useParams();
  //const [dateTime, setDateTime] = useState("");
  const { restaurant_id } = useParams();
  const navigate = useNavigate();
  //const reservationDate = restaurant_id;x
  const [isloading, setloading] = useState(false);
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

  const {
    state: { restaurantData },
  } = useLocation();

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

  const handleReservation = async (restaurant_id, restaurantData) => {
    setloading(true);
    var response;
    try {
      const datetime = `${date} ${time}`;
      // Make an API POST request to create a reservation
      // const restaurant_name = restaurantData.restaurant_name;

      response = await axios.post(
        //"https://nhmbrue00f.execute-api.us-east-1.amazonaws.com/dev/create-restaurant-reservation",
        //"https://xt9cbpo2ye.execute-api.us-east-1.amazonaws.com/dev/createreservation",
        //"https://y63heby3kj.execute-api.us-east-1.amazonaws.com/dev/createresrevation",
        // "https://k8mh0utk2m.execute-api.us-east-1.amazonaws.com/dev/create-reservation", //createreservationAhar
        "https://d2x4or4oci.execute-api.us-east-1.amazonaws.com/dev/create-reservation-customer-res-name", //createreservationwithCOnditionRestaurantName
        //"https://837jfnbfoh.execute-api.us-east-1.amazonaws.com/dev/create-reservation", //crateReservationwithLayers
        {
          no_of_people: parsedNoOfPeople,
          reservationDate: datetime,
          user_id,
          restaurant_id: parseInt(restaurant_id, 10),
          //restaurant_id: parsedRestaurantId,
          restaurant_name: restaurantData.restaurant_name,
        }
      );

      // Handle a successful reservation
      setReservationData(response.data);
      setloading(false);
      navigate("/view-reservations");
    } catch (error) {
      console.log(response);
      // Handle  errors, e.g., display an error message to the user
      console.error("Error creating reservation: ", error);
      setReservationData(null);
    }
  };

  return (
    <Container style={{ maxWidth: "600px" }}>
      <h2 style={{ textAlign: "center" }}>Reserve your table</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Row>
            <Form.Label>Restaurant ID is : {restaurant_id} </Form.Label>
            <Form.Label>
              Restaurant Name is : {restaurantData.restaurant_name}{" "}
            </Form.Label>
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
              // step="1"
              onChange={(e) => handleChange(e, "time")}
            />
          </Form.Group>
        </Row>
        <Row>
          {!isloading ? (
            <Button
              variant="primary"
              type="submit"
              style={{ margin: "20px auto" }}
              onClick={() => handleReservation(restaurant_id, restaurantData)}
            >
              Reserve table
            </Button>
          ) : (
            <Spinner animation="border" style={{ margin: "20px auto" }} />
          )}
        </Row>
      </Form>

      {reservationData && (
        <div>
          <p>Reservation created successfully!</p>
          <pre>{JSON.stringify(reservationData, null, 2)}</pre>
        </div>
      )}
    </Container>
  );
};

export default ReservationForm;
