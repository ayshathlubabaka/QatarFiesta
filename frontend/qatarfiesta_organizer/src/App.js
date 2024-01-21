import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './Pages/Home/Home';
import Register from './Pages/Register/Register';
import Login from './Pages/Login/Login';
import Otp from './Pages/Otp/Otp';
import CreateEvents from './Pages/CreateEvents/CreateEvents';
import AddTicket from './Pages/AddTicket/AddTicket';




function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="register/" element={<Register />} />
          <Route path="login/" element={<Login />} />
          <Route path="otp/" element={<Otp />} />
          <Route path="create_events/" element={<CreateEvents/>} />
          <Route path="add_tickets/" element={<AddTicket />} />
        </Routes>
    </div>
    </Router>
    
  );
}

export default App;
