import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import Navbar from "../../Components/Navbar/Navbar";
import randomColor from "randomcolor";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../../Components/Footer/Footer";
import Calendar from "react-calendar";
import "./EventsPage.css";
import { useAuth } from "../../AuthContext";

function EventsPage() {
  const location = useLocation();

  const [data, setData] = useState("");
  const [eventData, setEventData] = useState([]);
  const [categoryData, setcategoryData] = useState([]);
  const [filteredEventData, setFilteredEventData] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { user } = useAuth("");
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  const cloudURL = process.env.REACT_APP_CLOUDINARY_URL;

  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    setData(user);
  }, [user]);

  const handleClick = (newPage) => {
    setCurrentPage(newPage);
  };

  const displayedItems = filteredEventData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const navigate = useNavigate("");

  const fetchEventData = async () => {
    try {
      const response = await fetch(`${baseURL}/api/v1/organizer/active-event/`);
      const result = await response.json();
      setEventData(result);
      setFilteredEventData(result);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const fetchCategoryData = async () => {
    try {
      const response = await fetch(`${baseURL}/api/v1/admin/category/`, {
        method: "GET",
      });
      const result = await response.json();
      setcategoryData(result);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleViewEvent = (event_id) => {
    navigate(`/view_event/${event_id}`);
  };

  const handleFilter = (id) => {
    const newSelectedCategoryId = id === "all" ? null : id;
    setSelectedCategoryId(newSelectedCategoryId);
  };

  useEffect(() => {
    console.log("selectedid", selectedCategoryId);

    const filteredEvents = eventData.filter((event) =>
      selectedCategoryId ? event.category === selectedCategoryId : true
    );

    setFilteredEventData(filteredEvents);
    console.log("filtereddata", filteredEventData);
  }, [selectedCategoryId]);

  const handleDateChange = (date) => {
    console.log("Clicked date:", date);
    setSelectedDate(date);
    const eventsOnDate = eventData.filter((event) => {
      const eventStartDate = new Date(event.startDate);
      const eventEndDate = new Date(event.endDate);
      const clickedDateObj = new Date(date);

      return clickedDateObj >= eventStartDate && clickedDateObj <= eventEndDate;
    });
    setFilteredEventData(eventsOnDate);
  };

  const clearFilters = () => {
    setSelectedCategoryId(null);
    setFilteredEventData(eventData);
    setSelectedDate(new Date());
  };

  useEffect(() => {
    fetchEventData();
    fetchCategoryData();
  }, [location]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get("search");
    if (searchTerm) {
      const filteredEvents = eventData.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEventData(filteredEvents);
    }
  }, [location.search, eventData]);

  const FilterSection = () => (
    <div>
      <h5 className="font-weight-bold">Filter</h5>

      <ul className="list-group">
        {categoryData.map((item, id) => (
          <li
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center category list1"
            style={{ background: "#D3D3D3" }}
            onClick={() => handleFilter(item.id)}
          >
            {item.name}
            <span className="badge badge-primary badge-pill"></span>
          </li>
        ))}
        <li
          className="list-group-item list-group-item-action d-flex justify-content-between align-items-center category list1"
          style={{ background: "#D3D3D3" }}
          onClick={() => handleFilter("all")}
        >
          All<span className="badge badge-primary badge-pill"></span>
        </li>
      </ul>
    </div>
  );
  const EventListing = () => (
    <div className="d-flex flex-wrap justify-content-center mt-2">
      {displayedItems.map((item, id) => (
        <div key={id} className="card mb-3 mx-3" style={{ width: "30rem" }}>
          <img
            className="card-img-top"
            src={cloudURL + item.image}
            alt="Card image cap"
            style={{ height: "15rem" }}
          />
          <div className="card-body">
            <h5 className="card-title">{item.title}</h5>
            <hr className="black-line" />
            <p>
              <FaMapMarkerAlt className="mr-2" />
              {item.venue},{item.address}
            </p>
            <p>
              <FaCalendarAlt className="mr-2" /> {item.startDate} to{" "}
              {item.endDate}
            </p>
            <p>
              <FaClock className="mr-2" /> {item.startTime} to {item.endTime}
            </p>
            <hr className="black-line" />
            <button
              className="btn"
              onClick={() => handleViewEvent(item.id)}
              style={{ backgroundColor: randomColor(), width: "80%" }}
            >
              View/Book Event
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="">
      <div className="navbar-container">
        <Navbar />
      </div>
      <div className="row justify-content-center" style={{ height: "100px" }}>
        {categoryData.map((item, id) => (
          <div key={id} className="col-md-1">
            <ul className="list-group">
              <li
                className="list-group-item list-group-item-action justify-content-between category"
                style={{
                  background: randomColor(),
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {item.name}
              </li>
            </ul>
          </div>
        ))}
      </div>
      <div className="row">
        <div className="" style={{ width: "20px" }}></div>

        <div className="col-md-2 ml-5">
          <FilterSection />
          <h5 className="mt-5">Quick Search</h5>
          <Calendar onChange={handleDateChange} value={selectedDate} />
          <button className="btn btn-dark mt-5" onClick={clearFilters}>
            Clear All Filters
          </button>
        </div>
        <div className="col-md-9 border border-dark mb-2">
          <EventListing eventData={eventData} />
          <div className="pagination d-flex justify-content-center mt-3">
            {[
              ...Array(
                Math.ceil(filteredEventData.length / itemsPerPage)
              ).keys(),
            ].map((page) => (
              <button
                key={page}
                className={`btn ${
                  page === currentPage ? "btn-dark" : "btn-light"
                }`}
                onClick={() => handleClick(page)}
              >
                {page + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default EventsPage;
