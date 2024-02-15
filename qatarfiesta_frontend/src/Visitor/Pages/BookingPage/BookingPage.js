import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { useAuth } from "../../AuthContext";
import { AxiosCreateBooking, AxiosfetchActiveEvents } from "../../../api";

function BookingPage() {
  const { event_id } = useParams("");
  const navigate = useNavigate("");
  const [data, setData] = useState("");
  const [eventData, setEventData] = useState("");
  const [contactState, setContactState] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [numTickets, setNumTickets] = useState("");
  const [visitorNames, setVisitorNames] = useState(Array(numTickets).fill(""));
  const [totalPrice, setTotalPrice] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    setData(user);
  }, [user]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const generateDateOptions = (startDate, endDate) => {
    const dateOptions = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const formattedDate = currentDate.toISOString().split("T")[0];
      dateOptions.push(formattedDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateOptions;
  };

  const handleNumTicketsChange = (e) => {
    const newNumTickets = parseInt(e.target.value, 10);
    setNumTickets(newNumTickets);
    setVisitorNames((prevNames) => {
      const newNames = [...prevNames.slice(1, newNumTickets)];
      while (newNames.length < newNumTickets) {
        newNames.push("");
      }
      return newNames;
    });
  };

  const handleVisitorNameChange = (index, e) => {
    const newVisitorNames = [...visitorNames];
    newVisitorNames[index] = e.target.value;
    setVisitorNames(newVisitorNames);
  };

  const calculateTotalPrice = () => {
    const ticketPrice = eventData?.ticketPrice || 0;
    const total = numTickets * ticketPrice;
    setTotalPrice(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("inside submit");
    try {
      const response = await AxiosCreateBooking({
        event: event_id,
        date: selectedDate,
        numTickets,
        visitor_names: visitorNames,
        totalPrice,
        user: data.id.toString(),
      });
      console.log(response);
      console.log(response.status);
      if (response.status >= 200 && response.status < 300) {
        const result = response.data;
        console.log(result);
        console.log("Created booking successfully");
        const bookingDetails = {
          bookingId: result.id,
          eventId: eventData.id,
          selectedDate,
          numTickets,
          visitorNames,
          totalPrice,
          user: data.id,
        };
        navigate("/payment/", { state: { bookingDetails } });
      } else {
        console.log("Cannot create");
      }
    } catch (error) {
      console.log("something went wrong", error);
    }
  };

  const setDateOptions = () => {
    const start = new Date(eventData.startDate);
    const end = new Date(eventData.endDate);
    const currentDate = new Date(start);

    const dateOptions = [];

    while (currentDate <= end) {
      dateOptions.push(currentDate.toISOString());
      currentDate.setDate(currentDate.getDate() + 1);
    }
  };

  const fetchEventData = async (e) => {
    try {
      const response = await AxiosfetchActiveEvents();
      const result = response.data;
      console.log("active events", result);
      const selectedObject = result.find(
        (event) => event.id === parseInt(event_id)
      );
      setEventData(selectedObject);
      setDateOptions();
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchEventData();
    setDateOptions();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [numTickets]);

  return (
    <div>
      <Navbar contactState={contactState} event_id={event_id} />
      <div
        className="container"
        style={{
          backgroundColor: "gray",
          marginTop: "100px",
          marginBottom: "100px",
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="p-4 border border-secondary rounded"
        >
          <div className="mb-3">
            <label htmlFor="eventTitle" className="form-label">
              Event Title:
            </label>
            <input
              id="eventTitle"
              className="form-select"
              value={eventData.title}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="eventDate" className="form-label">
              Date:
            </label>
            <select
              id="eventDate"
              className="form-select"
              value={selectedDate}
              onChange={handleDateChange}
            >
              <option value="">Select a date</option>
              {eventData &&
                generateDateOptions(
                  new Date(eventData.startDate),
                  new Date(eventData.endDate)
                ).map((formattedDate) => (
                  <option key={formattedDate} value={formattedDate}>
                    {formattedDate}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="numTickets" className="form-label">
              Number of Tickets:
            </label>
            <select
              id="numTickets"
              className="form-select"
              value={numTickets}
              onChange={handleNumTicketsChange}
            >
              {Array.from({ length: 6 }, (_, index) => (
                <option key={index} value={index}>
                  {index}
                </option>
              ))}
            </select>
          </div>
          {Array.from({ length: numTickets }, (_, index) => (
            <div className="mb-3" key={index}>
              <label htmlFor={`visitorName${index}`} className="form-label">
                Visitor {index + 1} Name:
              </label>
              <input
                type="text"
                id={`visitorName${index}`}
                className="form-control"
                value={visitorNames[index]}
                onChange={(e) => handleVisitorNameChange(index, e)}
              />
            </div>
          ))}

          <h3>Total Ticket Price:</h3>
          <p>{`QAR ${totalPrice}`}</p>

          <button type="submit" className="btn btn-primary">
            Confirm Booking
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default BookingPage;
