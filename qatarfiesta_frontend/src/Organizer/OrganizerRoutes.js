import React from 'react'
import {Route, Routes, Navigate} from 'react-router-dom';
import Register from './Pages/Register/Register';
import Login from './Pages/Login/Login';
import Otp from './Pages/Otp/Otp';
import CreateEvents from './Pages/CreateEvents/CreateEvents';
import ManageEvent from './Pages/ManageEvent/ManageEvent';
import EditEvents from './Pages/EditEvents/EditEvents';
import EventView from './Pages/EventView/EventView';
import OrgDashboard from './Pages/OrgDasboard/OrgDashboard';
import ChatPage from './Pages/Chatpage/ChatPage';
import Messages from './Pages/Chatpage/Messages';
import BookingManagement from './Pages/BookingManagemen/BookingManagement';

function OrganizerRoutes() {
  return (
      <Routes>
        <Route path="/" element={<OrgDashboard />} />
        <Route path="register/" element={<Register />} />
        <Route path="login/" element={<Login />} />
        <Route path="otp/" element={<Otp />} />
        <Route path="create_events/" element={<CreateEvents/>} />
        <Route path="manage_events/" element={<ManageEvent/>} />
        <Route path="manage_booking/" element={<BookingManagement/>} />
        <Route path="edit_event/:event_id" element={<EditEvents />} />
        <Route path="view_event/:event_id" element={<EventView />} />
        <Route path="chat/:userId/:eventId" element={<ChatPage />} />
        <Route path="messages/" element={<Messages />} />
      </Routes>
  )
}

export default OrganizerRoutes
