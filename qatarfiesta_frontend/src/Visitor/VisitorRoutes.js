import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Otp from "./Pages/Otp/Otp";
import Register from "./Pages/Register/Register";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";
import EventView from "./Components/EventView/EventView";
import EventsPage from "./Pages/Eventspage/EventsPage";
import BookingPage from "./Pages/BookingPage/BookingPage";
import Payment from "./Components/Payment/Payment";
import OrderStatus from "./Components/OrderStatus/OrderStatus";
import MyBooking from "./Pages/MyBooking/MyBooking";
import Wallet from "./Pages/Wallet/Wallet";
import Userprofile from "./Pages/UserProfile/Userprofile";
import ChatPage from "./Pages/ChatPage/ChatPage";
import Contact from "./Pages/Contact/Contact";

function VisitorRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="register/" element={<Register />} />
        <Route path="login/" element={<Login />} />
        <Route path="otp/" element={<Otp />} />
        <Route path="forgot-password/" element={<ForgotPassword />} />
        <Route path="reset-password/" element={<ResetPassword />} />
        <Route path="view_event/:event_id" element={<EventView />} />
        <Route path="events/" element={<EventsPage />} />
        <Route path="booking_event/:event_id" element={<BookingPage />} />
        <Route path="payment/" element={<Payment />} />
        <Route path="order-status/" element={<OrderStatus />} />
        <Route path="my-booking/" element={<MyBooking />} />
        <Route path="contact/:event_id" element={<Contact />} />
        <Route path="chat/:userId/:eventId" element={<ChatPage />} />
        <Route path="wallet/" element={<Wallet />} />
        <Route path="profile/" element={<Userprofile />} />
      </Routes>
    </AuthProvider>
  );
}

export default VisitorRoutes;
