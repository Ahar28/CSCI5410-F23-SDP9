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
        <Route path="/Reservation" element={<ReservationForm />} />
      </Routes>
    </div>
  );
}

export default App;
