import React, {useState, useEffect} from 'react'
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Navbar from '../../Components/Navbar/Navbar'
import randomColor from 'randomcolor';
import { useNavigate} from 'react-router-dom';

function EventsPage() {

    const [data, setData] = useState('')
    const [eventData, setEventData] = useState([])
    const [categoryData, setcategoryData] = useState([])

    const navigate = useNavigate('')

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
        const response = await fetch('http://127.0.0.1:8000/api/v1/accounts/user/', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Request failed');
      }
      const data = await response.json();
      setData(data)
  
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
          setEventData(result)
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

      const handleViewEvent = (event_id) => {
        navigate(`/view_event/${event_id}`)
      }
    
  
    useEffect(() => {
      fetchUser();
      fetchEventData();
      fetchCategoryData();
    },[]);
      
      const FilterSection = () => (
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
      );
      
      const EventListing = () => (
          <div className='d-flex justify-content-center mt-2'  style={{border:"solid 1px gray"}}>
      {eventData.map((item, id) => (
        
        <div className="card mb-3 mx-2 mt-2" style={{ width: '18rem', backgroundColor:' #d3d3d3'}}>
        <img className="card-img-top" src="https://img.freepik.com/free-photo/excited-audience-watching-confetti-fireworks-having-fun-music-festival-night-copy-space_637285-559.jpg?size=626&ext=jpg&ga=GA1.1.632798143.1705622400&semt=ais" alt="Card image cap" />
        <p style={{fontSize:"14px", backgroundColor:"orange"}}><FaCalendarAlt className="mr-2" /> {item.startDate} to {item.endDate}</p>
        <div className="mb-2">
          <h5 className="card-title">{item.title}</h5>
          <p style={{fontSize:"12px", color:"blueviolet"}}><FaMapMarkerAlt className="mr-2" />{item.venue},{item.address}</p>
          <button className="btn btn-primary" onClick={() => handleViewEvent(item.id)}>View/Book Event</button>
        </div>
      </div>
      
      ))}
      </div>
      );



  return (
    <div className="dashboard py-3">
        <div>
            
        </div>
        <div className='row justify-content-center' style={{height:"100px"}}>
        
  {categoryData.map((item, id) => (
    <div key={id} className="col-md-2 mb-2">
      <ul className="list-group">
        <li className="list-group-item list-group-item-action justify-content-between category" style={{ background: randomColor(), color:"white" }}>
          {item.name}
        </li>
      </ul>
    </div>
  ))}

        </div>
    <div className="row">

      <div className="col-md-2 ml-5">
      
        <FilterSection />
    
      </div>
      <div className='col-md-9'>  
        {/* <div className='row mb-2 justify-content-center'>
        <form className="d-flex me-auto col-md-4">
      <input className="form-control me-2" type="text" placeholder="Search"  aria-label="Search" />
      <button className="btn btn-outline-success" type="submit"><i className='bi bi-search'></i></button>
    </form>
        </div> */}
      <EventListing eventData={eventData}/>
      </div>

    </div>
  </div>
  )
}

export default EventsPage
