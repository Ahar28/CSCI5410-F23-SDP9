import React, { useState, useEffect } from "react";
import { Container, Form, Row, Col, Button, Spinner, Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const EditReservationForm = () => {
  const { restaurant_id } = useParams();
  const location = useLocation();
  const { reservationData } = location.state || {};
  const navigate = useNavigate();

  const [user_id, setUserID] = useState("");
  const [time, setTime] = useState("");
  const [isloading, setloading] = useState(false);
  const [date, setDate] = useState("");
  const [rest_id, setrestaurantId] = useState("");
  const [no_of_people, setNumberOfPeople] = useState("");

  const parsedNoOfPeople = parseInt(no_of_people, 10);
  const parsedRestaurantId = parseInt(restaurant_id, 10);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  // console.log("restaurant_id : ", reservationData.restaurant_id);

  useEffect(() => {
    
    console.log("reservationData ahar :", reservationData);
    const user_id = sessionStorage.getItem("userId");
    setUserID(user_id);
  }, []);

  useEffect(() => {
    if (reservationData) {
      
      setNumberOfPeople(reservationData.data.required_capacity.toString());
      // setDate(reservationData.reservation_date);
      // setTime(reservationData.reservation_time);
      setrestaurantId(reservationData.data.restaurant_id);
      // Assuming reservationData.reservation_date is a plain object
      const seconds = reservationData.data.reservation_date._seconds +(4*3600);
      const nanoseconds = reservationData.data.reservation_date._nanoseconds ;

      // Create a new Date object
      const newreservationDate = new Date(seconds * 1000 + nanoseconds / 1e6);

      // Format date as "yyyy-MM-dd"
      const formattedDate = newreservationDate.toISOString().split("T")[0];

      // Format time manually as "HH:mm"
      const hours = newreservationDate.getHours();
      const minutes = newreservationDate.getMinutes();

      
      const formattedHours = hours.toString().padStart(2, "0");
      const formattedMinutes = minutes.toString().padStart(2, "0");

      const formattedTime = `${formattedHours}:${formattedMinutes}`;

      setDate(formattedDate);
      console.log(formattedDate);
      console.log(formattedTime);

      setTime(formattedTime);
      // set other form fields based on your data structure
    }
  }, [reservationData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
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

  const handleShowSuccessModal = (message) => {
    setModalMessage(message);
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleShowErrorModal = (message) => {
    setModalMessage(message);
    setShowErrorModal(true);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };


  const handleEditReservation = async () => {
    setloading(true);
    
    var response;
    try {
      const datetime = `${date} ${time}`;

      // Make an API PUT request to update the reservation
      response = await axios.put(
        //`https://pqnultyhi3.execute-api.us-east-1.amazonaws.com/dev/edit-reservation`,
       'https://b7g6enck49.execute-api.us-east-1.amazonaws.com/dev/edit-reservation', 
       {
          required_capacity: parsedNoOfPeople,
          newreservationDate: datetime,
          user_id,
          reservation_id: reservationData.id,
          restaurant_id: reservationData.data.restaurant_id,
        }
      );

      if (response.status === 200) {
        handleShowSuccessModal("ahar");
        setloading(false);
        navigate("/view-reservations");
      } else {
        handleShowErrorModal(`Reservation update failed with status: ${response.status}`);
        setloading(false);
      }

      // Handle a successful reservation update
      // setloading(false);
      // navigate("/view-reservations");
    } catch (error) {
      handleShowErrorModal("Error updating reservation. Please try again.");
      setloading(false);
      console.error("Error updating reservation: ", error);
    }
  };

  return (
    <Container style={{ maxWidth: "600px" }}>
      <h2 style={{ textAlign: "center" }}>Edit your Reservation</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Row>
            <Form.Label>Restaurant ID is : {rest_id} </Form.Label>
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
              //step="1"
              onChange={(e) => handleChange(e, "time")}
            />
          </Form.Group>
        </Row>
        <Row>
          {!isloading ? (
            <>
              <Button
                variant="primary"
                type="submit"
                style={{ margin: "20px auto" }}
                onClick={() => handleEditReservation()}
              >
                Confirm Changes
              </Button>
            </>
          ) : (
            <Spinner animation="border" style={{ margin: "20px auto" }} />
          )}
        </Row>
      </Form>
      {/* Modal for displaying success message */}
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Reservation updated successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseSuccessModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for displaying error message */}
      <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseErrorModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EditReservationForm;
