import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import './EventRequest.css';

function EventRequest() {

    const {event_request_id} = useParams()
    const [data, setData] = useState(null)
    const navigate = useNavigate();

    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
    };
  
    const formatTime = (timeString) => {
      return new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

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
      const response = await fetch('http://127.0.0.1:8000/api/v1/accounts/admin/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    if (!response.ok) {
      navigate('/admin/login/')
      throw new Error('Request failed');
      
    }
    const userData = await response.json();
    if (userData.is_superuser) {
      navigate('/admin/event_request/:event_request_id');
    } else {
      navigate('/admin/login');
    }
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
          const selectedObject = result.find((event) => event.id === parseInt(event_request_id));
          setData(selectedObject);
        } catch(error) {
          console.error('Error fetching data', error)
        }
      };
    
      useEffect(() => {
        fetchUser();
        fetchEventData();
      }, []);

      const handleApproval = async(event_request_id) => {
        try {
            await fetch(`http://127.0.0.1:8000/api/v1/admin/approve-event-request/${data.id}/`, {
              method: 'PUT',
              headers: {'Content-Type' :'application/json'},
              credentials: 'include',
            });
           
            console.log('Appoved successfully');
            navigate('/admin/')
        
          } catch (error) {
            console.error('Something went error:', error);
          }
        }

      const handleReject = async() => {
        try {
          await fetch(`http://127.0.0.1:8000/api/v1/admin/reject-event-request/${data.id}/`, {
            method: 'PUT',
            headers: {'Content-Type' :'application/json'},
            credentials: 'include',
          });
         
          console.log('Rejected successfully');
      
        } catch (error) {
          console.error('Something went error:', error);
        }
        navigate('/admin/')
        }

  return (
    <div className="container">
      <h2 className="heading">Event Request Details</h2>
      {data && (
        <div className="detailsContainer">
          <h1 className="title">{data.title}</h1>
          <p className="info">Venue: {data.venue}</p>
          <p className="info">Address: {data.address}</p>
          <p className="info">Start Date: {formatDate(data.startDate)}</p>
          <p className="info">End Date: {formatDate(data.endDate)}</p>
          <p className="info">Start Time: {formatTime(data.startTime)}</p>
          <p className="info">End Time: {formatTime(data.endTime)}</p>
          <p className="info">Description: {data.description}</p>
          <p className="info">Ticket Price: {data.ticketPrice}</p>
          <p className="info">Ticket Quantity: {data.ticketQuantity}</p>
        </div>
      )}
      <button className="button" onClick={handleApproval}>
        Approve
      </button>
      <button className="button rejectButton" onClick={handleReject}>
        Reject
      </button>
    </div>
  );
        }

export default EventRequest
