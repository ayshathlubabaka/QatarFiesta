import React, {useState, useEffect} from 'react'
import {Route, Routes, useNavigate} from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard';
import UserManage from './pages/UserManage/UserManage';
import OrganizerManage from './pages/OrganizerMange/OrganizerManage';
import CategoryManage from './pages/CategoryManage/CategoryManage';
import EventRequest from './pages/EventRequest/EventRequest';
import PendingEvents from './pages/PendingEvents/PendingEvents';
import EventView from './pages/EventView/EventView';
import Booking from './pages/Booking/Booking';


function AdminRoutes() {
  
  return (
    <AuthProvider>
    <Routes>
    <Route path='login/' element={<Login />} />
    <Route path='/' element={<Dashboard />} />
    <Route path='user/' element={<UserManage />} />
    <Route path='organizer/' element={<OrganizerManage />} />
    <Route path='category/' element={<CategoryManage />} />
    <Route path='event_request/:event_request_id' element={<EventRequest />} />
    <Route path='pending_events/' element={<PendingEvents />} />
    <Route path='view_event/:event_id' element={<EventView />} />
    <Route path='booking/' element={<Booking />} />
  </Routes>
  </AuthProvider>
  )
}

export default AdminRoutes
