import React from 'react'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

function UserRoutes() {
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
  )
}

export default UserRoutes
