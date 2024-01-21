import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link, useNavigate } from 'react-router-dom';

function Sidebar({ data, setData, accessToken, setAccessToken, setRefreshToken }) {

  const navigate = useNavigate()

  const handleLogout = () => {
    setAccessToken(null);
    setRefreshToken(null);

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    setData('')
    navigate('login/')

  };

  return (
    <div className='p-2 sidebar'>
      <div className='m-2 '>
        <i className='bi bi-bootstrap-fill me-3 fs-4'></i>
        <span className='brand-name fs-4'>Admin</span>
      </div>
      <hr className='text-dark' />
      <div className='list-group list-group-flush'>
        <a className='list-group-item py-2 ' href='/dashboard/'>
            <i className='bi bi-speedometer2 fs-5 me-2'></i>
            <span className='fs-5'>Dashboard</span>
        </a>
        <a className='list-group-item py-2 ' href='/user/'>
            <i className='bi bi-people fs-5 me-3'></i>
            <span className='fs-5'>User</span>
        </a>
        <a className='list-group-item py-2 ' href='/organizer/'>
            <i className='bi bi-person fs-5 me-3'></i>
            <span className='fs-5'>Organizer</span>
        </a>
        <a className='list-group-item py-2 ' href='/category/'>
            <i className='bi bi-table fs-5 me-3'></i>
            <span className='fs-5'>Category</span>
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
