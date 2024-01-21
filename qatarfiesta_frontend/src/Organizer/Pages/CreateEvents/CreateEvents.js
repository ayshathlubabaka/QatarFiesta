import React, {useState, useCallback, useEffect} from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MapBox from "../../Components/MapBox/MapBox";
import { useNavigate, useParams } from 'react-router-dom';

function CreateEvents({ organizerId }) {

  // const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.3813549162255!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e45da23048d5d17%3A0xca1f845ab174f573!2sKidZania%20Doha!5e0!3m2!1sen!2sin!4v1703003817662!5m2!1sen!2sin`;


  const [categoryData, setCategoryData] = useState([])
  const [title, setTitle] = useState('');
  const [venue, setVenue] = useState('');
  const [address, setAddress] = useState('');
  const [longitude, setLongitude] =useState('');
  const [latitude, setLatitude] =useState('');
  const [description, setDescription] =useState('');
  const [category, setCategory] =useState('');
  const [startDate, setStartDate] =useState(null);
  const [endDate, setEndDate] =useState(null);
  const [startTime, setStartTime] =useState('');
  const [endTime, setEndTime] =useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [ticketQuantity, setTicketQuantity] = useState('');
  const [image, setImage] = useState(null)

  const navigate = useNavigate()

  const [eventLocation, setEventLocation] = useState({
    latitude: 25.2598,
    longitude: 51.6143,
  });

  const handleLocationChange = (newLocation) => {
    setEventLocation(newLocation);
    setLatitude(newLocation.latitude)
    setLongitude(newLocation.longitude)
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file); 
    setImage(file);
  };


  const handleSubmit = async(e) => {
    e.preventDefault()
    if (startDate && endDate) {
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/organizer/event/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  // Set the content type to JSON
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      credentials: 'include',
      body: JSON.stringify({
        title,
        venue,
        address,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        description,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        startTime,
        endTime,
        category,
        organizer: organizerId.toString(),
        ticketPrice,
        ticketQuantity,
      })
      });
      if (response.ok) {
        console.log('Form submitted successfully');
        setTitle('');
      setVenue('');
      setAddress('');
      setLatitude('');
      setLongitude('');
      setDescription('');
      setStartDate(null);
      setEndDate(null);
      setStartTime('');
      setEndTime('');
      setCategory('');
      setTicketPrice('');
      setTicketQuantity('');
      setImage(null)
      alert('Your Event is submitted for admins approval')
      navigate('/organizer/manage_events/')
      } else {
        console.error('Form submission failed');
      }
    }catch(error){
      console.error('Error:', error);
    }
  }
    
  }
  const fetchCategoryData = async (e) => {
    try{
        const response = await fetch('http://127.0.0.1:8000/api/v1/admin/category/')
        const result = await response.json();
        setCategoryData(result);
        console.log(categoryData)
    }catch(error){
        console.error('Error fetching data', error)
    }
};


  useEffect(() => {
    fetchCategoryData();
  }, []);


  return (
  <div className="header bg-light p-1">
    <div className="table-border m-5 p-2">
      <form onSubmit={handleSubmit}>
        <h4>Add Event</h4>
        <div className="row mb-3">
          <div className="form-group col-md-6">
            <label htmlFor="title">Title</label>
            <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  placeholder="Enter event title"
                  onChange={e => setTitle(e.target.value)}
                />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="venue">Venue</label>
            <input
              type="text"
              className="form-control"
              id="venue"
              name="venue"
              placeholder="Enter venue"
              onChange={e=>setVenue(e.target.value)}
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
              placeholder="Enter event address"
              onChange={e=>setAddress(e.target.value)}
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
    onChange={e => setCategory(e.target.value)}
    >
      {categoryData.map(category => (<option key={category.id} value={category.id}>{category.name}</option>))}
    </select>
  </div>
  <div className="form-group col-md-6">
          
    <label htmlFor="image">Select Image</label>
    <input
      type="file"  
      className="form-control"
      id="image"
      name="file"
      onChange={handleFileChange} 
      style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
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
              placeholder="Add description"
              onChange={e=>setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
        <div className="form-group col-md-3">
          <label htmlFor="startDate">Start Date</label>
          <DatePicker
             selected={startDate}
             onChange={(date) => setStartDate(date)}
             className="form-control"
             placeholderText="Select start date"
             dateFormat="yyyy-MM-dd"
          />
        </div>
        <div className="form-group col-md-3">
          <label htmlFor="endDate">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="form-control"
            placeholderText="Select end date"
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
              placeholder="Enter start time"
              onChange={e=>setStartTime(e.target.value)}
            />
          </div>
          <div className="form-group col-md-3">
            <label htmlFor="endTime">End Time</label>
            <input
              type="text"
              className="form-control"
              id="endTime"
              name="endTime"
              placeholder="Enter end time"
              onChange={e=>setEndTime(e.target.value)}
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
              name="ticketPrie"
              placeholder="Enter ticket price"
              onChange={e=>setTicketPrice(e.target.value)}
            />
          </div>
          <div className="form-group col-md-6">
          <label htmlFor="ticketQuantity">Quantity of Tickets</label>
            <input
              type="text"
              className="form-control"
              id="ticketQuantity"
              name="ticketQuantity"
              placeholder="Enter quantity of tickets"
              onChange={e=>setTicketQuantity(e.target.value)}
            />
          </div>
          </div>
          
          <button className="btn btn-primary mt-1" type="submit">Add Event</button>
      </form>  
    </div>
  </div>
  );
}

export default CreateEvents;
