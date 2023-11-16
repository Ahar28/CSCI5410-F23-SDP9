import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ReservationsByUserID = () => {
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();
  //for delete
  const [showModal, setShowModal] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);

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
        console.log("response is +++", response);
        console.log("reservations ===++  ", reservations);
      } catch (error) {
        console.error("Error fetching reservations: ", error);
      }
    };

    fetchReservations();
  }, []);

  const handleEditClick = async () => {
    navigate(
      `/edit-reservation`
      // , { state: { restaurantData }, // Pass restaurantData as state }
    );
  };

  // const handleDeleteClick = (reservation) => {
  //   setReservationToDelete(reservation);
  //   setShowModal(true);
  // };

  const handleDeleteClick = (reservation) => {
    setReservationToDelete(reservation);
    setShowModal(true);
  };

  const handleDeleteConfirmation = async () => {
    setShowModal(false);

    try {
      // Make an API DELETE request to delete the reservation
      const response = await axios
        .delete
        //   `https://ftkd2l6ffi.execute-api.us-east-1.amazonaws.com/dev/deletereservation/id=${documentid}`
        ();

      // Handle a successful deletion
      console.log("Reservation deleted successfully:", response);
      // You may want to fetch the reservations again after deletion
      // to update the UI with the latest data.
    } catch (error) {
      // Handle errors, e.g., display an error message to the user
      console.error("Error deleting reservation: ", error);
    }
  };

  const handleDeleteCancel = () => {
    setShowModal(false);
    setReservationToDelete(null);
  };

  return (
    <>
      <Container>
        <h2 style={{ textAlign: "center" }}>All Reservations</h2>
        <Row>
          {reservations.map((reservation, index) => (
            <Col key={index} md={4}>
              <Card style={{ margin: "10px" }}>
                <Card.Body>
                  <Card.Title>Reservation ID: {index + 1}</Card.Title>
                  <Card.Text>
                    {/* <strong>User ID:</strong> {reservation.user_id}
                    <br /> */}
                    {/* <strong>Restaurant ID:</strong> {reservation.restaurant_id}
                    <br /> */}
                    <strong>Required Capacity:</strong>{" "}
                    {reservation.required_capacity}
                    <br />
                    <strong>Reservation Date:</strong>{" "}
                    {new Date(
                      reservation.reservation_date._seconds * 1000
                    ).toLocaleString()}
                    <br></br>
                    <Button onClick={() => handleEditClick()} variant="primary">
                      Edit
                    </Button>
                    {"     "}
                    {/* <Button onClick={() => handleDeleteClick()}>Delete</Button> */}
                    <Button
                      onClick={() => handleDeleteClick(reservation)}
                      variant="danger"
                    >
                      Delete
                    </Button>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      {/* Delete Confirmation Modal */}
      {/* <Modal show={showModal} onHide={handleDeleteCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this reservation?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirmation}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal> */}
    </>
  );
};

export default ReservationsByUserID;
