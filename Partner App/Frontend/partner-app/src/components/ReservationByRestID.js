import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ReservationsByRestID = () => {
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);

  useEffect(() => {
    // Function to fetch reservations
    const fetchReservationsbyRestID = async () => {
      try {
        const restaurant_id = sessionStorage.getItem("restaurant_id");
        // Make a GET request to your API endpoint
        const response = await axios.get(
          `https://v4ic130p27.execute-api.us-east-1.amazonaws.com/dev/get-reserversation-byresid?restaurant_id=${restaurant_id}`
        );

        // Update the state with the received data
        setReservations(
          response.data.document.map((reservation) => ({
            ...reservation,
            status: "Pending", // Set the initial status to "Pending"
          }))
        );
        console.log(
          "response of reservations by rest id ",
          response.data.document
        );
      } catch (error) {
        console.error("Error fetching reservations: ", error);
      }
    };

    fetchReservationsbyRestID();
  }, []);

  const handleEditClick = (reservation) => {
    console.log(reservation);
    navigate(`/edit-reservations`, {
      state: { reservationData: reservation },
    });
  };

  const handleApproveClick = (index) => {
    // Update the status of the reservation to "Approved"
    setReservations((prevReservations) => {
      const updatedReservations = [...prevReservations];
      updatedReservations[index].status = "Approved";
      return updatedReservations;
    });
  };

  const handleRejectClick = (index) => {
    // Update the status of the reservation to "Rejected"
    setReservations((prevReservations) => {
      const updatedReservations = [...prevReservations];
      updatedReservations[index].status = "Rejected";
      return updatedReservations;
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
        `https://8ayj6o7wsi.execute-api.us-east-1.amazonaws.com/dev/delete-reservation-partnerapp?reservation_id=${reservationToDelete.id}` //api = deleteReservationPartnerapp
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

  return (
    <>
     
      <Container>
      <h1 style={{ textAlign: "center" }}>Reservations of your Restaurant</h1>
        <Row>
          {reservations.map((reservation, index) => (
            <Col key={reservation.id} md={4}>
              <Card style={{ margin: "10px" }}>
                <Card.Body>
                  {/* <Card.Title>Reservation ID: {reservation.id}</Card.Title> */}
                  <Card.Text>
                    {/* <strong>User ID:</strong> {reservation.data.user_id} */}
                   
                    {/* <strong>Restaurant ID:</strong>{" "}
                    {reservation.data.restaurant_id} */}
                    <strong>Restaurant Name</strong>{" "}
                    {reservation.data.restaurant_name}
                    <br />
                    <strong>No. of People:</strong>{" "}
                    {reservation.data.no_of_people
                      ? reservation.data.no_of_people
                      : reservation.data.required_capacity}
                    <br />
                    <strong>Reservation Date:</strong>{" "}
                    {new Date(
                      reservation.data.reservation_date._seconds * 1000
                    ).toLocaleString()}
                    <br />
                    {reservation.status === "Pending" && (
                      <>
                      
                        <Button
                          onClick={() => handleApproveClick(index)}
                          style={{
                            marginRight: "5px",
                            backgroundColor: "green",
                            color: "white",
                          }}
                        >
                          Approve
                        </Button>{" "}
                        <Button
                          onClick={() => handleRejectClick(index)}
                          variant="primary"
                          style={{
                            backgroundColor: "red",
                            color: "white",
                          }}
                        >
                          Reject
                        </Button>{" "}
                        <br></br>
                        <br></br>
                        <Button
                          onClick={() => handleEditClick(reservation)}
                          variant="primary"
                          style={{
                            marginRight: "5px",
                            backgroundColor: "blue",
                            color: "white",
                          }}
                        >
                          Edit
                        </Button>{" "}
                        <Button
                          onClick={() => handleDeleteClick(reservation)}
                          variant="primary"
                          style={{
                            backgroundColor: "red",
                            color: "white",
                          }}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                    {reservation.status === "Approved" && (
                      <>
                        <p>Status: Approved</p>
                        <Button
                          onClick={() => handleEditClick(reservation)}
                          variant="primary"
                          style={{
                            marginRight: "5px",
                            backgroundColor: "blue",
                            color: "white",
                          }}
                        >
                          Edit
                        </Button>
                      </>
                    )}
                    {reservation.status === "Rejected" && (
                      <p>Status: Rejected</p>
                    )}
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
export default ReservationsByRestID;
