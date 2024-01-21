import React from 'react'
import {Route, Routes} from 'react-router-dom';
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import Otp from './Pages/Otp/Otp';
import Register from './Pages/Register/Register';
import ResetPassword from './Pages/ResetPassword/ResetPassword';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword';
import EventView from './Components/EventView/EventView';
import EventsPage from './Pages/Eventspage/EventsPage';

function VisitorRoutes() {
  return (
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="register/" element={<Register />} />
      <Route path="login/" element={<Login />} />
      <Route path="otp/" element={<Otp />} />
      <Route path="forgot-password/" element={<ForgotPassword />} />
      <Route path="reset-password/" element={<ResetPassword />} />
      <Route path="view_event/:event_id" element={<EventView />} />
      <Route path="events/" element={<EventsPage />} />
      </Routes>
  )
}

export default VisitorRoutes
