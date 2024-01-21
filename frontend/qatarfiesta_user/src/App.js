import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import Otp from './Pages/Otp/Otp';
import Register from './Pages/Register/Register';
import ResetPassword from './Pages/ResetPassword/ResetPassword';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword';


function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="register/" element={<Register />} />
      <Route path="login/" element={<Login />} />
      <Route path="otp/" element={<Otp />} />
      <Route path="forgot-password/" element={<ForgotPassword />} />
      <Route path="reset-password/" element={<ResetPassword />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;

