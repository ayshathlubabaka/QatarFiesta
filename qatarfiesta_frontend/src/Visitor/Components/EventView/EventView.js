import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/js/dist/dropdown'
import { useNavigate, useParams } from 'react-router-dom';
import GoogleMapLocator from '../../Components/GoogleMapLocator';
import Navbar from '../Navbar/Navbar';
import './EventView.css'

function EventView() {
    const {event_id} = useParams();

    const [eventData, setEventData] = useState('')
    const navigate = useNavigate();
    const [categoryData, setcategoryData] = useState([])
    const [contactState, setContactState] = useState(true)
    const baseURL = process.env.REACT_APP_API_BASE_URL

    const fetchEventData = async () => {
        try {
          const response = await fetch(`${baseURL}/api/v1/organizer/event/`)
          const result = await response.json();
          console.log('event data',result)
    
          const selectedObject = result.find((event) => event.id === parseInt(event_id));
          setEventData(selectedObject);
        } catch(error) {
          console.error('Error fetching data', error)
        }
      };

      const fetchCategoryData = async() => {
        try {
            const response = await fetch(`${baseURL}/api/v1/admin/category/`, {
                method:'GET'
            })
            const result = await response.json();
            console.log('event data',result)
            setcategoryData(result)
          } catch(error) {
            console.error('Error fetching data', error)
          }
      }

      const handleBookingConfirm = (eventDataId) => {
        const access = localStorage.getItem('access_token')
        if (!access) {
          alert('Login to book your event')
        } else {
        navigate(`/booking_event/${eventDataId}`)
        }
      }
    
      useEffect(() => {
        fetchEventData();
        fetchCategoryData();
      }, [event_id]);
    
  return (
    <div className='event-view-container'>
      <Navbar contactState={contactState} event_id={event_id}/>
      <div className='event-details-container'>
        <div className='col-md-1'></div>
        <div className='col-md-7 ml-3'>
        {eventData !== null ? (
          <div className='container-fluid1 border mt-3'>
            <h4 className='event-title'>{eventData.title}</h4>
            <div className='image-map-container'>
              <img src={eventData.image} alt='event-image' className='event-image' />
            </div>
            <div style={{width:"72rem"}}>
            <GoogleMapLocator latitude={eventData.latitude} longitude={eventData.longitude} />
            </div>
            <div className='event-info'>
              <p>
                <strong>Location:</strong> {eventData.venue}, {eventData.address}
              </p>
              <p>
                <strong>Date:</strong> {eventData.startDate} to {eventData.endDate}
              </p>
              <p>
                <strong>Time:</strong> {eventData.startTime} to {eventData.endTime}
              </p>
              <p>
                <strong>Price:</strong> {eventData.ticketPrice} QAR
              </p>
              <p>{eventData.description}</p>
              {eventData.ticketQuantity > 0 ? (
                <button
                  onClick={() => handleBookingConfirm(eventData.id)}
                  className='btn btn-primary booking-btn'
                  style={{background:"rgb(64, 64, 85)", width:"80%"}}
                >
                  Book Now
                </button>
              ) : (
                <h3 className='booking-closed'>Booking Closed</h3>
              )}
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

export default EventView
