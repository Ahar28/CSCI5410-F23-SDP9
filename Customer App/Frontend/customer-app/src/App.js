// Import modules and functions
import { Route,Routes } from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';
import RestaurantList from './components/RestaurantList'; // If there's an error line here ignore it
import RestaurantDetails from "./components/RestaurantDetails";
import './App.css';

function App() {
  // Routing tree
  return <Routes>
    <Route path='/' element={<Login/>} />
    <Route path='/signup' element={<Signup/>} />
    <Route path='/home' element={<RestaurantList/>} />
    <Route path='/restaurantpage' element={<RestaurantDetails/>}/>
  </Routes>
}

export default App;
