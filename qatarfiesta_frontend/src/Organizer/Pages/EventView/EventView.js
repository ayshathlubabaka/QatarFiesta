import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/js/dist/dropdown'
import { useNavigate, useParams } from 'react-router-dom';
import GoogleMapLocator from '../../Components/GoogleMapLocator';


function EventView() {
    const {event_id} = useParams();

    const [data, setData] = useState('')
    const [eventData, setEventData] = useState('')
    const navigate = useNavigate();

    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);

    const handleTokenRefresh = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/v1/accounts/api/token/refresh/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              refresh: refreshToken,
            }),
          });
    
          if (!response.ok) {
            throw new Error('Token refresh failed');
          }
    
          const { access, refresh } = await response.json();
          setAccessToken(access);
          setRefreshToken(refresh);
    
          localStorage.setItem('access_token', access);
          localStorage.setItem('refresh_token', refresh);
    
        } catch (error) {
          console.error('Token refresh failed', error);
        }
      };
    
      
    
      const fetchUser = async() => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/v1/accounts/organizer/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        if (!response.ok) {
          navigate('/organizer/login/')
          throw new Error('Request failed');
          
        }
        const userData = await response.json();
        navigate(`/organizer/view_event/${event_id}`);
        setData(userData);
        console.log(userData)
    
          } catch(error) {
            if (error.status === 401) {
              await handleTokenRefresh();
            }
          }
      }
    
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
    
      useEffect(() => {
        fetchUser();
        fetchEventData();
      }, [event_id]);
    
  return (
    <div className='container-fluid bg-white min-vh-100 dashboard'>
      <button onClick={() => navigate('/organizer/')}>Go Back</button>
      <div className='row'>
        <div className='col'>
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
