import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/js/dist/dropdown'
import { useNavigate, useParams } from 'react-router-dom';
import GoogleMapLocator from '../../Components/GoogleMapLocator';

function EventView() {
    const {event_id} = useParams();

    const [eventData, setEventData] = useState('')
    const navigate = useNavigate();
    const [categoryData, setcategoryData] = useState([])

    const fetchEventData = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/v1/organizer/event/')
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
            const response = await fetch('http://127.0.0.1:8000/api/v1/admin/category/', {
                method:'GET'
            })
            const result = await response.json();
            console.log('event data',result)
            setcategoryData(result)
          } catch(error) {
            console.error('Error fetching data', error)
          }
      }
    
      useEffect(() => {
        fetchEventData();
        fetchCategoryData();
      }, [event_id]);
    
  return (
    <div className='container-fluid bg-white min-vh-100 dashboard'>

      <button onClick={() => navigate('/events/')}>Go Back</button>
      <div className='row'>
      <div className="col-md-2 ml-5">
      
      <div>
          <h5 className="font-weight-bold">Categories</h5>
          <ul className="list-group">
            {categoryData.map((item, id) => (
                <li className="list-group-item list-group-item-action d-flex justify-content-between align-items-center category">
                {item.name} <span className="badge badge-primary badge-pill"></span>
              </li>
            ))}
          </ul>
        </div>
  
    </div>
        <div className='col-md-8'>
        <div className='px-3'>
        {eventData !== null ? (
  <div className='container-fluid border border-dark mt-3'>
    <h4>Title: {eventData.title}</h4>
    <p>Category: {eventData.category}</p>
  <GoogleMapLocator latitude={eventData.latitude} longitude={eventData.longitude} />
  <p>Location: {eventData.venue},{eventData.address}</p>
  <p>Date: {eventData.startDate} to {eventData.endDate}</p>
  <p>Time: {eventData.startTime} to {eventData.endTime}</p>
  <p>Price: {eventData.ticketPrice} QAR</p>
  <p>{eventData.description}</p>
  <button>Book Now</button>
  </div>
) : (
  <p>Loading...</p>
)}
        </div>
        </div>
      </div>
    </div>
  )
}

export default EventView
