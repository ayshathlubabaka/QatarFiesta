import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate} from 'react-router-dom';

function Events() {

  const [eventData, setEventData] = useState([]);
  const navigate = useNavigate('')

  const fetchEventData = async() => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/organizer/event/', {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Request failed');
      }
      const res = await response.json();
      setEventData(res)
  
    } catch(error) {

    }
  }

  const handleViewEvent = (event_id) => {
    navigate(`/view_event/${event_id}/`)
  }

  useEffect(() => {
    fetchEventData();
  }, [])
  return (
    <div>
      <div className='heading mt-5'>
      <h1>Events list here</h1>
      </div>
      <div className='d-flex justify-content-center mt-5'>
      {eventData.map((item, id) => (
        
        <div className="card mb-3 mx-3" style={{ width: '25rem' }}>
        <img className="card-img-top" src="https://img.freepik.com/free-photo/excited-audience-watching-confetti-fireworks-having-fun-music-festival-night-copy-space_637285-559.jpg?size=626&ext=jpg&ga=GA1.1.632798143.1705622400&semt=ais" alt="Card image cap" />
        <div className="card-body">
          <h5 className="card-title">{item.title}</h5>
          <p><FaMapMarkerAlt className="mr-2" />{item.venue},{item.address}</p>
          <p><FaCalendarAlt className="mr-2" /> {item.startDate} to {item.endDate}</p>
          <p>QAR {item.ticketPrice}</p>
          <button className="btn btn-primary" onClick={() => handleViewEvent(item.id)}>View/Book Event</button>
        </div>
      </div>
      
      ))}
      </div>
    <div className='seeMore mb-3'>
      <button>See More </button>
    </div>
    </div>
    
  )
}

export default Events
