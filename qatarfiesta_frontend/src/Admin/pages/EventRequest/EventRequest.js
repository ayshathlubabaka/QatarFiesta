import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import './EventRequest.css';
function EventRequest() {

    const {event_request_id} = useParams()
    const [data, setData] = useState(null)
    const navigate = useNavigate();
    const baseURL = process.env.REACT_APP_API_BASE_URL

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
    };
  
    const formatTime = (timeString) => {
      return new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const fetchEventData = async () => {
        try {
          const response = await fetch(`${baseURL}/api/v1/organizer/event/`)
          const result = await response.json();
          const selectedObject = result.find((event) => event.id === parseInt(event_request_id));
          setData(selectedObject);
        } catch(error) {
          console.error('Error fetching data', error)
        }
      };
    
      useEffect(() => {
        fetchEventData();
      }, []);

      const handleApproval = async(event_request_id) => {
        try {
            await fetch(`${baseURL}/api/v1/admin/approve-event-request/${data.id}/`, {
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
        const isConfirmed = window.confirm('Are you sure you want to reject this event?');
        if (isConfirmed) {
        try {
          await fetch(`${baseURL}/api/v1/admin/reject-event-request/${data.id}/`, {
            method: 'PUT',
            headers: {'Content-Type' :'application/json'},
            credentials: 'include',
          });
         
          console.log('Rejected successfully');
      
        } catch (error) {
          console.error('Something went error:', error);
        }
      } else {
        console.log('Event cancellation is not success')
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
