import { Route, Routes } from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/signup";
import HomePage from "./components/home";
import "./App.css";
import RestaurantList from "./components/RestaurantList";
import RestaurantDetails from "./components/RestaurantDetails";
import CreateRestaurant from "./components/CreateRestaurant";
import ViewReservations from "./components/ViewReservations";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<RestaurantList />} />
        <Route
          path="/restaurantpage/:restaurant_id"
          element={<RestaurantDetails />}
        />
        <Route path="/restaurant/create" element={<CreateRestaurant />}></Route>
        <Route path="/view-reservations" element={<ViewReservations />}></Route>
      </Routes>
    </div>
  );
}

export default App;
