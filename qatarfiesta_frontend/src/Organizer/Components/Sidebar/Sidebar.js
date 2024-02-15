import React, {useState, useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom';

function Sidebar() {

  const navigate = useNavigate();
  const [data, setData] = useState("");

  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [newChatCount, setNewChatCount] = useState(0)
  const [socket, setSocket] = useState(null);
  const baseURL = process.env.REACT_APP_API_BASE_URL
  const chatURL = process.env.REACT_APP_WS_BASE_URL

  const fetchPendingChats = async () => {
    try {
      const response = await fetch(`${baseURL}/api/chat/pending-chats/`, {
      method:"GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    const data = await response.json();
    console.log('pending chats',data)
      setNewChatCount(data.length);
      
    } catch (error) {
      console.error('Error fetching pending chats:', error);
    }
  };
  useEffect(() => {
    const access_token = localStorage.getItem('access_token');
    const path = `${chatURL}/ws/chat-count/?token=${access_token}`;
        const newSocket = new WebSocket(path);
    
    newSocket.onopen = () => {
      newSocket.send(JSON.stringify({
        'message':'From Client'
      }))
      console.log('WebSocket connected');
    };
  
    newSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('event data', message);
      setNewChatCount(message.count);
    };
  
    newSocket.onclose = () => {
      console.log('WebSocket closed');
    };
  
    setSocket(newSocket);
  
    return () => {
      newSocket.close();
    };
  }, []); 


  const handleTokenRefresh = async () => {
    try {
      const response = await fetch(
        `${baseURL}/api/v1/accounts/api/token/refresh/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh: refreshToken,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const { access, refresh } = await response.json();
      setAccessToken(access);
      setRefreshToken(refresh);

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
    } catch (error) {
      console.error("Token refresh failed", error);
    }
  };



  const fetchUser = async () => {
    try {
      const response = await fetch(
        `${baseURL}/api/v1/accounts/organizer/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (!response.ok) {
        navigate('/organizer/login/')
        throw new Error("Request failed");
      }
      const data = await response.json();
      if (data.is_organizer) {
        console.log('organizer')
      } else {
        alert('User is not an organizer')
        navigate('/organizer/login');
      }
      setData(data);
      console.log(data);
    } catch (error) {
      if (error.status === 401) {
        await handleTokenRefresh();
        await fetchUser();
      }
    }
  };

  useEffect(() => {
    console.log("inside organizer home");
    fetchUser();
    fetchPendingChats();
  }, [accessToken, refreshToken]);


  const handleLogout = () => {
    setAccessToken(null);
    setRefreshToken(null);

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setData("");
    navigate("/organizer/login/");
  };

  return (
      <div className='list-group list-group-flush'>
      <a className='list-group-item py-2 ' href='/organizer/'>
            <span className='fs-5'>{data.name}</span>
        </a>
        <a className='list-group-item py-2 ' href='/organizer/'>
            <i className='bi bi-speedometer2 fs-5 me-2'></i>
            <span className='fs-5'>DashQ</span>
        </a>
        <a className='list-group-item py-2 ' href='/organizer/manage_events/'>
            <i className='bi bi-person fs-5 me-3'></i>
            <span className='fs-5'>Manage Events</span>
        </a>
        <a className='list-group-item py-2 ' href='/organizer/create_events/'>
            <i className='bi bi-table fs-5 me-3'></i>
            <span className='fs-5'>Create Events</span>
        </a>
        <a className='list-group-item py-2' href='/organizer/messages/'>
        <i className='bi bi-envelope fs-5 me-3'></i>
            <span className='fs-5'>Messages</span>
            {newChatCount > 0 && ( 
                       <div className="notification-icon">
                       <i className="bi bi-bell-fill text-danger"></i> {/* Red bell icon */}
                       <span className="badge bg-danger">{newChatCount}</span> {/* Badge showing the new chat count */}
                   </div>
                    )}
        </a>
        <a className='list-group-item py-2 ' href='/organizer/manage_booking/'>
            <i className='fs-5 me-3'></i>
            <span className='fs-5'>Manage Booking</span>
        </a>
        <a className='list-group-item py-2 '>
            <i className='fs-5 me-3'></i>
            <span className='fs-5'></span>
        </a>
        <button className='btn btn-danger mt-auto' onClick={handleLogout}>Logout</button>
        
      </div>

  )
}

export default Sidebar