import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import MapBox from "../../Components/MapBox/MapBox";
import "react-datepicker/dist/react-datepicker.css";
import Sidebar from "../../Components/Sidebar/Sidebar";

function EditEvents() {
  const { event_id } = useParams();
  const navigate = useNavigate("");
  const baseURL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetchCategoryData();
    fetchEventData();
  }, []);

  const [categoryData, setCategoryData] = useState([]);
  const [eventData, setEventData] = useState({
    title: "",
    venue: "",
    address: "",
    latitude: "",
    longitude: "",
    description: "",
    category: "",
    startDate: null,
    endDate: null,
    startTime: "",
    endTime: "",
    ticketPrice: "",
    ticketQuantity: "",
  });

  const [eventLocation, setEventLocation] = useState({
    latitude: 25.2598,
    longitude: 51.6143,
  });

  const handleLocationChange = (newLocation) => {
    setEventData((prevData) => ({
      ...prevData,
      latitude: newLocation.latitude,
      longitude: newLocation.longitude,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    setEventData({ ...eventData, image: file });
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${baseURL}/api/v1/organizer/event-change/${event_id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // Set the content type to JSON
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          credentials: "include",
          body: JSON.stringify(eventData),
        }
      );

      if (response.status === 200) {
        alert("Event updated successfully");
        navigate("/organizer/");
      } else {
        console.error("Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const fetchCategoryData = async (e) => {
    try {
      const response = await fetch(`${baseURL}/api/v1/admin/category/`);
      const result = await response.json();
      setCategoryData(result);
      console.log(categoryData);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const fetchEventData = async (e) => {
    try {
      const response = await fetch(`${baseURL}/api/v1/organizer/event/`);
      const result = await response.json();
      console.log("event data", result);

      const selectedObject = result.find(
        (event) => event.id === parseInt(event_id)
      );
      setEventData({
        ...eventData,
        title: selectedObject.title,
        venue: selectedObject.venue,
        address: selectedObject.address,
        latitude: selectedObject.latitude,
        longitude: selectedObject.longitude,
        description: selectedObject.description,
        startDate: selectedObject.startDate,
        endDate: selectedObject.endDate,
        startTime: selectedObject.startTime,
        endTime: selectedObject.endTime,
        category: selectedObject.category,
        ticketPrice: selectedObject.ticketPrice,
        ticketQuantity: selectedObject.ticketQuantity,
        image: selectedObject.image,
      });
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  return (
    <div className="container-fluid bg-white min-vh-100 ">
      <div className="row">
        <div className="col-2 sidebar">
          <Sidebar />
        </div>
        <div className="col-md-1"></div>
        <div className="col-8 ml-3">
          <div className="header bg-light p-1">
            <div className="table-border m-5 p-2">
              <form onSubmit={handleUpdateEvent}>
                <h4>Add Event</h4>
                <div className="row mb-3">
                  <div className="form-group col-md-6">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      value={eventData.title}
                      onChange={(e) =>
                        setEventData({ ...eventData, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="venue">Venue</label>
                    <input
                      type="text"
                      className="form-control"
                      id="venue"
                      name="venue"
                      value={eventData.venue}
                      onChange={(e) =>
                        setEventData({ ...eventData, venue: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="form-group col-md-12">
                    <label htmlFor="address">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      name="address"
                      value={eventData.address}
                      onChange={(e) =>
                        setEventData({ ...eventData, address: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <MapBox
                      location={eventLocation}
                      onLocationChange={handleLocationChange}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="form-group col-md-6">
                    <label htmlFor="eventCategory">Select Category</label>
                    <select
                      className="form-control"
                      id="category"
                      name="category"
                      value={eventData.category}
                    >
                      {categoryData.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="image">Select Image</label>
                    <input
                      type="file"
                      className="form-control"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="form-group col-md-12">
                    <label htmlFor="description">Add Description</label>
                    <input
                      type="text"
                      className="form-control"
                      id="description"
                      name="description"
                      value={eventData.description}
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="form-group col-md-3">
                    <label htmlFor="startDate">Start Date</label>
                    <DatePicker
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          startDate: e.target.value,
                        })
                      }
                      className="form-control"
                      value={eventData.startDate}
                      dateFormat="yyyy-MM-dd"
                    />
                  </div>
                  <div className="form-group col-md-3">
                    <label htmlFor="endDate">End Date</label>
                    <DatePicker
                      onChange={(e) =>
                        setEventData({ ...eventData, endDate: e.target.value })
                      }
                      className="form-control"
                      value={eventData.endDate}
                      dateFormat="yyyy-MM-dd"
                    />
                  </div>
                  <div className="form-group col-md-3">
                    <label htmlFor="startTime">Start Time</label>
                    <input
                      type="text"
                      className="form-control"
                      id="startTime"
                      name="startTime"
                      value={eventData.startTime}
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          startTime: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group col-md-3">
                    <label htmlFor="endTime">End Time</label>
                    <input
                      type="text"
                      className="form-control"
                      id="endTime"
                      name="endTime"
                      value={eventData.endTime}
                      onChange={(e) =>
                        setEventData({ ...eventData, endTime: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="form-group col-md-6">
                    <label htmlFor="ticketPrice">Ticket Price</label>
                    <input
                      type="text"
                      className="form-control"
                      id="ticketPrie"
                      name="ticketPrice"
                      value={eventData.ticketPrice}
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          ticketPrice: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="ticketQuantity">Quantity of Tickets</label>
                    <input
                      type="text"
                      className="form-control"
                      id="ticketQuantity"
                      name="ticketQuantity"
                      value={eventData.ticketQuantity}
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          ticketQuantity: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <button className="btn btn-primary mt-1" type="submit">
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditEvents;
