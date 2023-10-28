// Import modules and functions
import { Route,Routes } from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';
import RestaurantList from './components/restaurantList'; // If there's an error line here ignore it
import RestaurantDetails from "./components/RestaurantDetails";
import './App.css';
import NotificationSubscriber from './components/NotificationSubscriber';


function App() {
  // Routing tree
  return (
    <div>
      <NotificationSubscriber />  {/* Include NotificationSubscriber */}
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/home' element={<RestaurantList/>} />
        <Route path='/restaurantpage/:restaurant_id' element={<RestaurantDetails/>}/>
      </Routes>
    </div>
  );
}

export default App;
