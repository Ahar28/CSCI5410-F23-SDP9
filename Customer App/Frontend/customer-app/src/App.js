// Import modules and functions
import { Route,Routes } from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';
import RestaurantList from './components/RestaurantList'; // If there's an error line here ignore it
import RestaurantDetails from "./components/RestaurantDetails";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NotificationSubscriber from "./components/NotificationSubscriber";
import ReservationForm from "./components/Reservation";
import ReservationsByUserID from "./components/ReservationsByUserID";
import EditReservationForm from "./components/EditReservation";

function App() {
  // Routing tree
  return (
    <div>
      <NotificationSubscriber /> {/* Include NotificationSubscriber */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<RestaurantList />} />
        <Route
          path="/restaurantpage/:restaurant_id"
          element={<RestaurantDetails />}
        />
        <Route
          path="/Reservation/:restaurant_id"
          element={<ReservationForm />}
        />
        <Route path="/view-reservations" element={<ReservationsByUserID />} />
        <Route path="/edit-reservation" element={<EditReservationForm />} />
      </Routes>
    </div>
  );
}

export default App;
