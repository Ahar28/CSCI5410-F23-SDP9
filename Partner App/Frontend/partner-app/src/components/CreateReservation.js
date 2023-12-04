import React, { useState, useEffect } from "react";
import { Container, Form, Row, Col, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import PopupModal from "./PopupModal";

const CreateReservationForm = () => {

//const { restaurant_id } = useParams();
//const [dateTime, setDateTime] = useState("");
//const restaurant_id = sessionStorage.getItem("restaurant_id");

  const navigate = useNavigate();
  const [isloading, setloading] = useState(false);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [no_of_people, setNumberOfPeople] = useState("");
  const [reservationData, setReservationData] = useState(null);
  const parsedNoOfPeople = parseInt(no_of_people, 10);
  const [restaurantData, setRestaurantData] = useState(null);
  //const parsedRestaurantId = parseInt(restaurant_id, 10);
  const restaurant_id = sessionStorage.getItem("restaurant_id");
  const user_id = sessionStorage.getItem("userId");
  
  //for popup
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  //for menu
  const [cartItems, setCartItems] = useState([]);

   const handleSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    async function fetchRestuarantDetail() {
      const headers = {
        "Content-type": "application/json",
      };
      const resData = await axios.get(
        `https://2iqvxzgo50.execute-api.us-east-1.amazonaws.com/dev/restaurant?restaurantId=${restaurant_id}`,
        { headers }
      );
      console.log("restaurant Edit",resData);
      const resJsonData = JSON.parse(resData.data.body);
      setRestaurantData(resJsonData.Item);
      console.log(resJsonData.Item);
    }
    fetchRestuarantDetail();
  }, [restaurant_id]);

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

  const handleHomeClick = () => {
    navigate("/home");
  };

  //cart
  const addToCart = (menuItem) => {
    setCartItems([...cartItems, menuItem]);
    console.log("reservationData : ",restaurantData)
  };

  const removeFromCart = (menuItem) => {
    const itemIndex = cartItems.findIndex((item) => item === menuItem);
  
    if (itemIndex !== -1) {
      const updatedCart = [...cartItems];
      updatedCart.splice(itemIndex, 1);
  
      setCartItems(updatedCart);
    }
  };

  // Function to show the modal with a message
  const handleShowModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  // Function to hide the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleReservation = async (restaurant_id) => {
    setloading(true);
    var response;
    try {

      const datetime = `${date} ${time}`;

      const totalCapacity = restaurantData.tables.reduce(
        (total, table) => total + parseInt(table.size, 10),
        0
      );
  
      // Check if no_of_people is greater than the total capacity
      if (parsedNoOfPeople > totalCapacity) {
        handleShowModal(
          `Cannot create reservation. The number of people exceeds the total capacity of tables.`
        );
        setloading(false);
        return;
      }

      // Create an array to store selected menu items and their quantities
      const selectedMenuItems = cartItems?.map((item) => ({
        name: item.name,
        quantity: cartItems.filter((cartItem) => cartItem === item).length,
    }));

      try{
        response = await axios.post(
          //"https://tmcslgdz06.execute-api.us-east-1.amazonaws.com/dev/create-reservation-partnerapp",
            "https://38irl8wai5.execute-api.us-east-1.amazonaws.com/dev/create-reservation",
          {
            no_of_people: parsedNoOfPeople,
            reservationDate: datetime,
            user_id,
            restaurant_id,
            selectedMenuItems,
          }
        );

        setReservationData(response.data);
        handleShowModal(
          `Reservation Created Successfully`
        );
          setloading(false);
          navigate("/view-reservations");
      }
      catch{
        handleShowModal(`Cannot Create Reservation outside operating hours: `);
        setReservationData(null);
        setloading(false);
      }
    
      // Handle a successful reservation
      // setReservationData(response.data);
      // setloading(false);
      // navigate("/view-reservations");

    } 
    catch (error) {

      handleShowModal("Error creating reservation. Please try again.");
      setReservationData(null);
      setloading(false);
 
    }
  };

  return (
    <>
    <Button   onClick={() => handleHomeClick()} variant="primary" style={{color: "white",}}> Home </Button>
    <Container style={{ maxWidth: "600px" }}>
      <h2 style={{ textAlign: "center" }}>Reserve Table</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Row>
            {/* <Form.Label>Restaurant ID is : {restaurant_id} </Form.Label> */}
          </Row>
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label style={{ fontWeight: "bold"}}>No of People</Form.Label>
            <Form.Control
              type="number"
              placeholder="party size "
              value={no_of_people}
              onChange={(e) => handleChange(e, "no_of_people")}
              min={1}
              max={20}
            />
            <Form.Label style={{ fontWeight: "bold"}}>Date</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => handleChange(e, "date")}
            />
            <Form.Label style={{ fontWeight: "bold"}}>Time</Form.Label>
            <Form.Control
              type="time"
              value={time}
              onChange={(e) => handleChange(e, "time")}
            />
          </Form.Group>
        </Row>
        <Row>
          <div>
            <br></br>
            <h2 style={{ textAlign: "center"}}>Menu</h2>
            {restaurantData?.menu?.map((menuItem, index) => (
              <div key={index}>
                <Form.Group controlId={`menuItemName-${index}`}>
                  <p style={{ fontWeight: "bold"}}>{menuItem.name}</p>
                </Form.Group>
                <Form.Group controlId={`menuItemImage-${index}`}>
                  <img src={menuItem.image} alt={`Item ${index}`} style={{ maxWidth: '100px', maxHeight: '100px' }} />
                </Form.Group>
                <Form.Group controlId={`menuItemPrice-${index}`}>
                  <p></p>
                  <p style={{ fontWeight: "bold"}}>
                   Price : ${menuItem.price}
                    </p>
                </Form.Group>
                <div>
                  <Button
                    variant="primary"
                    onClick={() => addToCart(menuItem)}
                    style={{ marginRight: "10px" }}
                  >
                    +
                  </Button>
                  <span>{cartItems.filter((item) => item === menuItem).length}</span>
                  <Button
                    variant="danger"
                    onClick={() => removeFromCart(menuItem)}
                    style={{ marginLeft: "10px" }}
                  >
                    -
                  </Button>
                </div>
                <hr />
              </div>
            ))}
            {cartItems.length > 0 && (
              <div>
                <h2>Cart</h2>
                <ul>
                  {Array.from(new Set(cartItems)).map((cartItem, index) => (
                    <li key={index}>
                      <div>{cartItem.name}</div>
                      <div>Quantity: {cartItems.filter((item) => item === cartItem).length}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Row>
        <Row>
          {!isloading ? (
            <Button
              variant="primary"
              type="submit"
              style={{ margin: "20px auto" }}
              onClick={() => handleReservation(restaurant_id)}
            >
              Reserve table
            </Button>
          ) : (
            <Spinner animation="border" style={{ margin: "20px auto" }} />
          )}
        </Row>
      </Form>

      <PopupModal show={showModal} onHide={handleCloseModal} message={modalMessage} />

      {reservationData && (
        <div>
          <p>Reservation created successfully!</p>
          <pre>{JSON.stringify(reservationData, null, 2)}</pre>
        </div>
      )}
    </Container>
    </>
  );
};

export default CreateReservationForm;
