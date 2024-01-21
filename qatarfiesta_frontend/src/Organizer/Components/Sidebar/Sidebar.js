import React, {useState, useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom';

function Sidebar({ data, setData, setAccessToken, setRefreshToken, onMenuClick }) {

  const navigate = useNavigate();
  const menuItems = ['Dashboard','ManageEvent', 'CreateEvents']

  const handleLogout = () => {
    setAccessToken(null);
    setRefreshToken(null);

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setData("");
    navigate("/organizer/");
  };

  return (
<div className='p-2 sidebar' style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
  <div className='m-2'>
    <i className='bi bi-bootstrap-fill me-3 fs-4'></i>
    <span className='brand-name fs-4'>{data.name}</span>
  </div>
  <hr className='text-dark' />
  <div className='list-group list-group-flush flex-grow-1'>
    <div>
      {menuItems.map((menu, index) => (
        <div key={index} onClick={() => onMenuClick(menu)}>
          {menu}
        </div>
      ))}
    </div>
    <div className='mt-auto'> {/* mt-auto pushes the logout button to the bottom */}
      <button className="logout_btn" onClick={handleLogout}>Logout</button>
    </div>
  </div>
</div>
  )
}

export default Sidebar
