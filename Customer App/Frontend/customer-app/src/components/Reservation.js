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
  const [user_email, setUserEmail] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [no_of_people, setNumberOfPeople] = useState("");
  const [reservationData, setReservationData] = useState(null);
  const parsedNoOfPeople = parseInt(no_of_people, 10);
  const parsedRestaurantId = parseInt(restaurant_id, 10);
  
  //new
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
  };

  // const removeFromCart = (menuItem) => {
  //   const updatedCart = cartItems.filter((item) => item !== menuItem);
  //   setCartItems(updatedCart);
  // };

  const removeFromCart = (menuItem) => {
    const itemIndex = cartItems.findIndex((item) => item === menuItem);
  
    if (itemIndex !== -1) {
      const updatedCart = [...cartItems];
      updatedCart.splice(itemIndex, 1);
  
      setCartItems(updatedCart);
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
          user_email  
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
      <br></br>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Row>
            {/* <Form.Label>Restaurant ID is : {restaurant_id} </Form.Label> */}
            
            <Form.Label>
              Restaurant Name : {restaurantData.restaurant_name}{" "}
            </Form.Label>
           
          </Row>
          <Form.Group as={Col} controlId="formGridEmail">
          <br></br>
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
          <div>
            <br></br>
            <h2>Menu</h2>
            {restaurantData.menu.map((menuItem, index) => (
              <div key={index}>
                <Form.Group controlId={`menuItemName-${index}`}>
                  <p>{menuItem.name}</p>
                </Form.Group>
                <Form.Group controlId={`menuItemImage-${index}`}>
                  <img src={menuItem.image} alt={`Item ${index}`} style={{ maxWidth: '100px', maxHeight: '100px' }} />
                </Form.Group>
                <Form.Group controlId={`menuItemPrice-${index}`}>
                  <p></p>
                  <p>{menuItem.price}</p>
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
             {/* {restaurantData.menu && restaurantData.menu.length > 0 && (
        <div>
          <h2>Menu</h2>
          <ul>
            {restaurantData.menu.map((item, index) => (
              <li key={index}>
                <div className="menu-item">
                  <img src={item.image} alt={`Menu Item Image ${index}`} />
                </div>
                <div>{item.name}</div>
                <div>{item.price}</div>
              </li>
            ))}
          </ul>
        </div>
      )} */}
      
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
