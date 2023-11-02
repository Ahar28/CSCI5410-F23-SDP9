import React, { useState } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";

const ReservationForm = () => {
  const [dateTime, setDateTime] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle the form submission here, for example, by making an API request to create the reservation.
  };

  const handleChange = (e, key) => {
    if (key === "numberOfPeople") {
      setNumberOfPeople(e.target.value);
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Reserve your table</h2>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>No of People</Form.Label>
              <Form.Control
                type="number"
                placeholder="party size "
                value={numberOfPeople}
                onChange={(e) => handleChange(e, "numberOfPeople")}
                min={1}
                max={20}
              />
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" />
              <Form.Label>Time</Form.Label>
              <Form.Control type="time" />
            </Form.Group>
          </Row>
          <Button variant="primary" type="submit" style={{ marginTop: "20px" }}>
            Reserve table
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default ReservationForm;
