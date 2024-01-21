import React, {useState, useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link, useNavigate } from 'react-router-dom';

function Sidebar() {

  const navigate = useNavigate()
  const [data, setData] = useState('')

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
      console.log('superuser')
      navigate('/admin/');
    } else {
      console.log('not superuser')
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

    useEffect(() => {
      console.log('inside admin home')
      fetchUser();
    }, []);

  const handleLogout = () => {
    setAccessToken(null);
    setRefreshToken(null);

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    setData('')
    navigate('/admin/login')

  };

  return (
    <div className='p-2 sidebar'>
      <div className='m-2 '>
        <i className='bi bi-bootstrap-fill me-3 fs-4'></i>
        <span className='brand-name fs-4'>Admin</span>
      </div>
      <hr className='text-dark' />
      <div className='list-group list-group-flush'>
        <a className='list-group-item py-2 ' href='/admin/'>
            <i className='bi bi-speedometer2 fs-5 me-2'></i>
            <span className='fs-5'>Dashboard</span>
        </a>
        <a className='list-group-item py-2 ' href='/admin/user/'>
            <i className='bi bi-people fs-5 me-3'></i>
            <span className='fs-5'>User</span>
        </a>
        <a className='list-group-item py-2 ' href='/admin/organizer/'>
            <i className='bi bi-person fs-5 me-3'></i>
            <span className='fs-5'>Organizer</span>
        </a>
        <a className='list-group-item py-2 ' href='/admin/category/'>
            <i className='bi bi-table fs-5 me-3'></i>
            <span className='fs-5'>Category</span>
        </a>
        <a className='list-group-item py-2' href='/admin/pending_events/'>
            <i className='fs-5 me-3'></i>
            <span className='fs-5'>Events</span>
        </a>
        <a className='list-group-item py-2 '>
            <i className='fs-5 me-3'></i>
            <span className='fs-5'></span>
        </a>
        <a className='list-group-item py-2 '>
            <i className='fs-5 me-3'></i>
            <span className='fs-5'></span>
        </a>
        <a className='list-group-item py-2 '>
            <i className='fs-5 me-3'></i>
            <span className='fs-5'></span>
        </a>
        <a className='list-group-item py-2 '>
            <i className='fs-5 me-3'></i>
            <span className='fs-5'></span>
        </a>
        <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
        
      </div>
    </div>
  )
}

export default Sidebar
