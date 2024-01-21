import React, {useState, useCallback, useEffect} from "react";
import AddTicket from "../AddTicket/AddTicket";
import Sidebar from "../../Components/Sidebar/Sidebar";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';



function CreateEvents() {

  // const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.3813549162255!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e45da23048d5d17%3A0xca1f845ab174f573!2sKidZania%20Doha!5e0!3m2!1sen!2sin!4v1703003817662!5m2!1sen!2sin`;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const generateDateOptions = () => {
    const options = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      options.push({ value: currentDate.toISOString(), label: currentDate.toDateString() });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return options;
  };

  return (
    <div className="dashboard">
      <div className="row">
        <div className="col-2 sidebar">
          <Sidebar />
        </div>
        <div className="col-1"></div>
        <div className="col-8 mt-3">
  <div className="header bg-light">
    <h2>Create Events</h2>
    <div className="table-border mt-2">
      <form>
        <h4>Add Event</h4>
        <div className="row mb-3">
          <div className="form-group col-md-6">
            <label htmlFor="eventTitle">Title</label>
            <input
              type="text"
              className="form-control"
              id="eventTitle"
              placeholder="Enter event title"
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="eventVenue">Venue</label>
            <input
              type="text"
              className="form-control"
              id="eventVenue"
              placeholder="Enter venue"
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="form-group col-md-6">
            <label htmlFor="eventAddress">Address</label>
            <input
              type="text"
              className="form-control"
              id="eventAddress"
              placeholder="Enter event address"
            />
          </div>
          <div className="row col-md-6">
          <label>Location:</label>
          <div className="form-group col-md-6">
          <input
              type="text"
              className="form-control"
              id="latitude"
              placeholder="latitude"
            />
          </div>
          <div className="form-group col-md-6">
          <input
              type="text"
              className="form-control"
              id="longitude"
              placeholder="longitude"
            />
          </div>
          {/* <GoogleMapLocator onLocationSelect={handleLocationSelect}/> */}
            <div>
    </div>
          </div>
        </div>
        <div className="row mb-3">
  <div className="form-group col-md-6">
    <label htmlFor="eventCategory">Select Category</label>
    <input
      type="text"
      className="form-control"
      id="eventCategory"
      placeholder="Select event category"
    />
  </div>
  <div className="form-group col-md-6">
    <label htmlFor="eventImage">Select Image</label>
    <input
      type="file"  // Set the input type to "file" for image selection
      className="form-control"
      id="eventImage"
      accept="image/*"  // Specify accepted file types (in this case, any image)
    />
  </div>
</div>
        <div className="row mb-3">
          <div className="form-group col-md-12">
            <label htmlFor="additionalCategory">Add Description</label>
            <input
              type="text"
              className="form-control"
              id="additionalCategory"
              placeholder="Add description"
            />
          </div>
        </div>
        <div className="row mb-3">
        <div className="form-group col-md-3">
          <label htmlFor="startDate">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="form-control"
            id="startDate"
            placeholderText="Select start date"
          />
        </div>
        <div className="form-group col-md-3">
          <label htmlFor="endDate">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="form-control"
            id="endDate"
            placeholderText="Select end date"
          />
        </div>
          <div className="form-group col-md-3">
            <label htmlFor="startTime">Start Time</label>
            <input
              type="text"
              className="form-control"
              id="startTime"
              placeholder="Enter start time"
            />
          </div>
          <div className="form-group col-md-3">
            <label htmlFor="endTime">End Time</label>
            <input
              type="text"
              className="form-control"
              id="endTime"
              placeholder="Enter end time"
            />
          </div>
          </div>
          <button className="btn btn-primary mt-2">Add Event</button>
          {/* <div className="row mb-3">
  <h4>Add Time Slots</h4>
  <div className="form-group col-md-4">
    <label htmlFor="startTime">Start Time</label>
    <input
      type="text"
      className="form-control"
      id="startTime"
      placeholder="Enter start time"
    />
  </div>
  <div className="form-group col-md-4">
    <label htmlFor="endTime">End Time</label>
    
    <input
      type="text"
      className="form-control"
      id="endTime"
      placeholder="Enter end time"
    />
    
  </div>
  <div>
  <label htmlFor="endTime"></label><br/>
  <button className="btn btn-primary mt-2">Add</button>
  </div>
  
</div> */}
        
        
        <div>
          {/* Assuming this is a custom component for adding tickets */}
          <AddTicket />
        </div>
        <div>
          <button>Submit</button>
        </div>
      </form>
    </div>
  </div>
</div>
      </div>
    </div>
  );
}

export default CreateEvents;
