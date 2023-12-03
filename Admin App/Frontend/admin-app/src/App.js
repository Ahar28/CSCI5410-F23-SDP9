import { Route,Routes } from 'react-router-dom';
import Login from './components/login';
import HomePage from './components/home'
import './App.css';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage/>} />
      </Routes>
    </div>
  );
}

export default App;
