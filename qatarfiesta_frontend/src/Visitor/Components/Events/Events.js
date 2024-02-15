import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { useNavigate} from 'react-router-dom';
import randomColor from 'randomcolor';

function Events() {

  const [eventData, setEventData] = useState([]);
  const navigate = useNavigate('')

  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(0);
  const baseURL = process.env.REACT_APP_API_BASE_URL

  const handleClick = (newPage) => {
    setCurrentPage(newPage);
  };

  const displayedItems = eventData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const fetchEventData = async() => {
    try {
      const response = await fetch(`${baseURL}/api/v1/organizer/active-event/`, {
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
    <div className='row' style={{borderLeft:"solid 30px black", borderRight:"solid 30px black"}}>
      <div className='heading'>
      <h1>Events</h1>
      </div>
      <div>
      <div className='d-flex justify-content-center'>
        {displayedItems.map((item, id) => (
          <div key={id} className="card mb-3 mx-3 p-2">
            <img className="card-img-top" src={item.image} alt="Card image cap" style={{ height: "20rem"}} />
            <div className="card-body">
              <h5 className="card-title">{item.title}</h5>
              <hr className="black-line" />
              <p><FaMapMarkerAlt className="mr-2" />{item.venue},{item.address}</p>
              <p><FaCalendarAlt className="mr-2" /> {item.startDate} to {item.endDate}</p>
              <p><FaClock className="mr-2" /> {item.startTime} to {item.endTime}</p>
              <hr className="black-line" />
              <button className="btn" onClick={() => handleViewEvent(item.id)} style={{backgroundColor:randomColor(), width:"80%"}}>View/Book Event</button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination d-flex justify-content-center mt-3 mb-2">
        {[...Array(Math.ceil(eventData.length / itemsPerPage)).keys()].map((page) => (
          <button
            key={page}
            className={`btn ${page === currentPage ? 'btn-dark' : 'btn-light'}`}
            onClick={() => handleClick(page)}
          >
            {page + 1}
          </button>
        ))}
      </div>
    </div>
    </div>
    
  )
}

export default Events
