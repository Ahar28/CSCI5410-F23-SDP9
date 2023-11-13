import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import axios from "axios";

const ReservationsByUserID = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    // Getting the user_id from session storage
    const user_id = sessionStorage.getItem("userId");

    // API GET request to fetch reservations for the specific user
    const fetchReservations = async () => {
      try {
        const response = await axios.get(
          `https://7jk304w1wf.execute-api.us-east-1.amazonaws.com/dev/getreservationbyuserid?user_id=${user_id}`
        );
        setReservations(response.data.document);
      } catch (error) {
        console.error("Error fetching reservations: ", error);
      }
    };

    fetchReservations();
  }, []);

  return (
    <Container>
      <h2 style={{ textAlign: "center" }}>All Reservations</h2>
      <Row>
        {reservations.map((reservation, index) => (
          <Col key={index} md={4}>
            <Card style={{ margin: "10px" }}>
              <Card.Body>
                <Card.Title>Reservation ID: {index + 1}</Card.Title>
                <Card.Text>
                  <strong>User ID:</strong> {reservation.user_id}
                  <br />
                  <strong>Restaurant ID:</strong> {reservation.restaurant_id}
                  <br />
                  <strong>Required Capacity:</strong>{" "}
                  {reservation.required_capacity}
                  <br />
                  <strong>Reservation Date:</strong>{" "}
                  {new Date(
                    reservation.reservation_date._seconds * 1000
                  ).toLocaleString()}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ReservationsByUserID;
