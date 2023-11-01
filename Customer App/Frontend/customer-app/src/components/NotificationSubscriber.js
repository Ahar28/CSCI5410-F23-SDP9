import React, { useEffect, useState } from "react";
import "./../NotificationSubscriber.css";

function NotificationSubscriber() {
  const [ws, setWs] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [offers, setOffers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const websocket = new WebSocket(
      "wss://9t8racifi9.execute-api.us-east-1.amazonaws.com/production"
    );
    setWs(websocket);

    websocket.onopen = () => {
      console.log("WebSocket connection opened.");
    };

    websocket.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      console.log("Message received:", messageData);
      setOffers((prevOffers) => [...prevOffers, ...messageData.new_offers]);
      setRestaurants((prevRestaurants) => [
        ...prevRestaurants,
        ...messageData.opening_restaurants,
      ]);
    };

    return () => {
      websocket.close();
    };
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div>
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      ></link>
      <button onClick={toggleNotifications} className="icon-button">
        <span class="material-icons">notifications</span>
        <span class="icon-button__badge"></span>{" "}
        {offers.length + restaurants.length > 0 && (
          <span>({offers.length + restaurants.length})</span>
        )}
      </button>

      {showNotifications && (
        <div className="notification-window">
          {offers.length + restaurants.length === 0 ? (
            <div className="notification-item">No new notifications</div>
          ) : (
            <div>
              <div className="notification-header">
                <strong>New Offers & Restaurants Open:</strong>
              </div>
              {offers.map((offer, index) => (
                <div key={index} className="notification-item">
                  Offer: {offer}
                </div>
              ))}
              {restaurants.map((restaurant, index) => (
                <div key={index} className="notification-item">
                  Restaurant {restaurant} is now open, go check it out!
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationSubscriber;
