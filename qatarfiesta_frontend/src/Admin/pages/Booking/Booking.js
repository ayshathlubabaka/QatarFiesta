import React, { useContext, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Sidebar from "../../Components/Sidebar";
import { useNavigate } from "react-router-dom";
import "./Booking.css";

function Booking() {
  const [eventData, setEventData] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate("");

  const baseURL = process.env.REACT_APP_API_BASE_URL;

  const fetchBookingData = async () => {
    try {
      const response = await fetch(`${baseURL}/api/v1/admin/booking/`);
      if (!response.ok) {
        throw new Error("Request failed");
      }
      const data = await response.json();
      setBookingData(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching booking data", error);
    }
  };

  const fetchEventData = async () => {
    try {
      const response = await fetch(`${baseURL}/api/v1/organizer/event/`);
      const result = await response.json();
      console.log("event data", result);
      setEventData(result);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const filteredData = bookingData.filter((item) => {
    if (filter === "all") {
      return true;
    } else if (filter === "pending") {
      return item.status === "pending";
    } else if (filter === "complete") {
      return item.status === "complete";
    } else if (filter === "cancelled") {
      return item.status === "cancelled";
    }
  });

  useEffect(() => {
    fetchBookingData();
    fetchEventData();
  }, []);

  const getEventTitle = (eventId) => {
    const event = eventData.find((event) => event.id === eventId);
    return event ? event.title : "Unknown Event";
  };

  return (
    <div className="row">
      <div className="col-2 sidebar">
        <Sidebar />
      </div>
      <div className="col-8">
        <h2>Booking Data</h2>
        <div className="row" style={{ height: "2rem" }}>
          <div className="col-md-6">
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="complete">Complete</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        {bookingData.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Booking Id</th>
                <th>Booking Date</th>
                <th>Event</th>
                <th>Event Date</th>
                <th>Number of Tickets</th>
                <th>Total Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.booking_date}</td>
                  <td
                    style={{
                      fontWeight: "bolder",
                      cursor: "pointer",
                      color: "blue",
                    }}
                    onClick={() =>
                      navigate(`/admin/view_event/${booking.event}/`)
                    }
                  >
                    {getEventTitle(booking.event)}
                  </td>
                  <td>{booking.date}</td>
                  <td>{booking.numTickets}</td>
                  <td>{booking.totalPrice}</td>
                  <td>{booking.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div>
            <img
              src="https://assets-v2.lottiefiles.com/a/92920ca4-1174-11ee-9d90-63f3a87b4e3d/c6NYERU5De.png"
              alt="No data available"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Booking;
