import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col, Button, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ReservationsByUserID = () => {
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();
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
        console.log("response ", response.data.document);
        setReservations(response.data.document);
        console.log("reservations are : ", reservations);
      } catch (error) {
        console.error("Error fetching reservations: ", error);
      }
    };

    fetchReservations();
  }, []);

  const handleEditClick = (reservation) => {
    console.log(reservation);
    navigate(`/edit-reservation`, {
      state: { reservationData: reservation },
    });
  };

  const handleDeleteClick = (reservation) => {
    setReservationToDelete(reservation);
    setShowModal(true);
  };

  const handleDeleteConfirmation = async () => {
    setShowModal(false);

    try {
      // Make an API DELETE request to delete the reservation
      await axios.delete(
        // `https://ftkd2l6ffi.execute-api.us-east-1.amazonaws.com/dev/deletereservation?id=${reservationToDelete.id}`
        `https://gg9z253h82.execute-api.us-east-1.amazonaws.com/dev/delete-reservation?id=${reservationToDelete.id}` //api = deleteReservationAhar
      );

      // Handle a successful deletion
      console.log("Reservation deleted successfully");

      navigate("/view-reservations");
      // Reload the page

      window.location.reload();
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

  const handleViewRestauantsClick = () => {
    navigate("/home");
  };

  return (
    <>
      <Button variant="primary" onClick={() => handleViewRestauantsClick()}>
        View Restaurants
      </Button>
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
                    <strong>
                      Restaurant_name : {reservation.data.restaurant_name}
                    </strong>{" "}
                    <br></br>
                    <strong>No of People :</strong>{" "}
                    {/* {reservation.data.no_of_people} */}
                    {reservation.data.no_of_people
                      ? reservation.data.no_of_people
                      : reservation.data.required_capacity}
                    <br />
                    <strong>Doc id : </strong> {reservation.id}
                    <br />
                    <strong>Reservation Date:</strong>{" "}
                    {new Date(
                      reservation.data.reservation_date._seconds * 1000
                    ).toLocaleString()}
                    <br></br>
                    <Button
                      onClick={() => handleEditClick(reservation)}
                      variant="primary"
                    >
                      Edit
                    </Button>
                    {"     "}
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteClick(reservation)}
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
      <Modal show={showModal} onHide={handleDeleteCancel}>
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
      </Modal>
    </>
  );
};

export default ReservationsByUserID;
