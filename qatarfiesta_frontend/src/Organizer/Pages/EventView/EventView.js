import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/js/dist/dropdown";
import { useNavigate, useParams } from "react-router-dom";
import GoogleMapLocator from "../../Components/GoogleMapLocator";
import Sidebar from "../../Components/Sidebar/Sidebar";

function EventView() {
  const { event_id } = useParams();

  const [data, setData] = useState("");
  const [eventData, setEventData] = useState("");
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_BASE_URL;

  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const handleTokenRefresh = async () => {
    try {
      const response = await fetch(
        `${baseURL}/api/v1/accounts/api/token/refresh/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh: refreshToken,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const { access, refresh } = await response.json();
      setAccessToken(access);
      setRefreshToken(refresh);

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
    } catch (error) {
      console.error("Token refresh failed", error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await fetch(`${baseURL}/api/v1/accounts/organizer/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (!response.ok) {
        navigate("/organizer/login/");
        throw new Error("Request failed");
      }
      const userData = await response.json();
      navigate(`/organizer/view_event/${event_id}`);
      setData(userData);
      console.log(userData);
    } catch (error) {
      if (error.status === 401) {
        await handleTokenRefresh();
        await fetchUser();
      }
    }
  };

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
    fetchUser();
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
                  src={eventData.image}
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
