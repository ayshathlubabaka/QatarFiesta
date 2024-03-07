import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/js/dist/dropdown";
import Sidebar from "../../Components/Sidebar";
import GoogleMapLocator from "../../Components/GoogleMapLocator";
import "./EventView.css";
import { useNavigate, useParams } from "react-router-dom";

function EventView() {
  const { event_id } = useParams();
  const [eventData, setEventData] = useState("");
  const navigate = useNavigate("");
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  const cloudURL = process.env.REACT_APP_CLOUDINARY_URL;

  const fetchEventData = async () => {
    try {
      const response = await fetch(`${baseURL}/api/v1/organizer/event/`);
      const result = await response.json();
      console.log("event data", result);

      const selectedObject = result.find(
        (event) => event.id === parseInt(event_id)
      );
      setEventData(selectedObject);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [event_id]);

  return (
    <div className="container-fluid bg-white min-vh-100 ">
      <div className="row">
        <div className="col-2 sidebar">
          <Sidebar />
        </div>
        <div className="col-md-1"></div>
        <div className="col-7 ml-3">
          {eventData !== null ? (
            <div className="container-fluid1 border border-dark mt-3 mb-3">
              <h4 className="event-title">{eventData.title}</h4>
              <div className="image-map-container">
                <img
                  src={cloudURL + eventData.image}
                  alt="event-image"
                  className="event-image"
                />
              </div>
              <div style={{ width: "72rem" }}>
                <GoogleMapLocator
                  latitude={eventData.latitude}
                  longitude={eventData.longitude}
                />
              </div>
              <div className="event-info">
                <p>
                  <strong>Location:</strong> {eventData.venue},{" "}
                  {eventData.address}
                </p>
                <p>
                  <strong>Date:</strong> {eventData.startDate} to{" "}
                  {eventData.endDate}
                </p>
                <p>
                  <strong>Time:</strong> {eventData.startTime} to{" "}
                  {eventData.endTime}
                </p>
                <p>
                  <strong>Price:</strong> {eventData.ticketPrice} QAR
                </p>
                <p>{eventData.description}</p>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventView;
