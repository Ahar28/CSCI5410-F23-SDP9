import React, { useState, useEffect } from "react";
import { Container, Form, Row, Col, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import PopupModal from "./PopupModal";

const ReservationForm = () => {

  const navigate = useNavigate();
  const { restaurant_id } = useParams();
  const [isloading, setloading] = useState(false);
  const [user_id, setUserID] = useState("");
  const [user_email, setUserEmail] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [no_of_people, setNumberOfPeople] = useState("");
  const [reservationData, setReservationData] = useState(null);
  const parsedNoOfPeople = parseInt(no_of_people, 10);
  const parsedRestaurantId = parseInt(restaurant_id, 10);

  //for popup
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  //for menu
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const user_id = sessionStorage.getItem("userId");
    setUserID(user_id);
  });

  useEffect(() => {
    const user_email = sessionStorage.getItem("user_email");
    setUserEmail(user_email);
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

  const handleReservation = async (restaurant_id, restaurantData) => {
    setloading(true);
    var response;
    try{
    
      
      const datetime = `${date} ${time}`;

      // Calculate the total capacity of all tables
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
      const selectedMenuItems = cartItems.map((item) => ({
          name: item.name,
          quantity: cartItems.filter((cartItem) => cartItem === item).length,
      }));

      try{
      response = await axios.post(
          
          // "https://k8mh0utk2m.execute-api.us-east-1.amazonaws.com/dev/create-reservation", //createreservationAhar
          //"https://d2x4or4oci.execute-api.us-east-1.amazonaws.com/dev/create-reservation-customer-res-name", //createreservationwithCOnditionRestaurantName
          //"https://837jfnbfoh.execute-api.us-east-1.amazonaws.com/dev/create-reservation", //crateReservationwithLayers
          "https://b7g6enck49.execute-api.us-east-1.amazonaws.com/dev/create-reservation", //new lab lambda
          {
            no_of_people: parsedNoOfPeople,
            reservationDate: datetime,
            user_id,
            restaurant_id: restaurant_id,
            restaurant_name: restaurantData.restaurant_name,
            user_email,
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
        
        // Handle a successful reservation
        // setReservationData(response.data);
        // setloading(false);
        // navigate("/view-reservations");
catch{
        // if (response.status === 200) {
              
        //   setReservationData(response.data);
        //   setloading(false);
        //   navigate("/view-reservations");
      
        // } else {
          
          handleShowModal(`Cannot Create Reservation outside operating hours: `);
          setReservationData(null);
          setloading(false);
      
       // }
}
    }
    catch (error) {

          handleShowModal("Error creating reservation. Please try again.");
          setReservationData(null);
          setloading(false);
    }
  };

  return (
    <>
    <Container style={{ maxWidth: "600px" }}>
      <h2 style={{ textAlign: "center",fontWeight: 'bold',fontSize: '2.0em'  }}>Reserve your table</h2>
      
      <h5 style={{ textAlign: "center" }}>at</h5>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Row>
            {/* <Form.Label>Restaurant ID is : {restaurant_id} </Form.Label> */}
            <Form.Label style={{ textAlign: "center", fontWeight: "bold",fontSize: '1.4em'  }}>
               {restaurantData.restaurant_name}{" "}
            </Form.Label>
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
              // step="1"
              onChange={(e) => handleChange(e, "time")}
            />
          </Form.Group>
        </Row>
        <Row>
          <div>
            <br></br>
            <h2 style={{ textAlign: "center"}}>Menu</h2>
            {restaurantData.menu.map((menuItem, index) => (
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
              onClick={() => handleReservation(restaurant_id, restaurantData)}
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

export default ReservationForm;
