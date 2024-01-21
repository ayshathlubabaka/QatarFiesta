import React from 'react'
import {Route, Routes} from 'react-router-dom';
import Home from './Pages/Home/Home';
import Register from './Pages/Register/Register';
import Login from './Pages/Login/Login';
import Otp from './Pages/Otp/Otp';
import CreateEvents from './Pages/CreateEvents/CreateEvents';
import ManageEvent from './Pages/ManageEvent/ManageEvent';
import EditEvents from './Pages/EditEvents/EditEvents';
import EventView from './Pages/EventView/EventView';

function OrganizerRoutes() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="register/" element={<Register />} />
        <Route path="login/" element={<Login />} />
        <Route path="otp/" element={<Otp />} />
        <Route path="create_events/" element={<CreateEvents/>} />
        <Route path="manage_events/" element={<ManageEvent/>} />
        <Route path="edit_event/:event_id" element={<EditEvents />} />
        <Route path="view_event/:event_id" element={<EventView />} />
      </Routes>
  )
}

export default OrganizerRoutes
