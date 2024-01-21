import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import {GiHamburgerMenu} from 'react-icons/gi'

const Navbar = ({ data, setData, accessToken, setAccessToken, setRefreshToken }) => {

  const navigate = useNavigate()

  const [state, setState] = useState(false)

  const handleSubmitEvent = () => {

    const destinationURL = 'organizer/';

    window.location.href = destinationURL;
  }

  const handleLogout = () => {
    setAccessToken(null);
    setRefreshToken(null);

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    setData('')
    setState(false)
    navigate('/')

  };

  const openEventsPage = () => {
    navigate('/events/')
  }

  useEffect(() => {
    if (!data) {
      navigate('/');
    }
  }, [navigate, accessToken, data]);


  return (
    <div>
      <div className={state===false ? 'navbar' : 'navbar1'}>
        <div className="logo-container">
          <img className="logo" src='../../../Image-1 (4).jpg' alt="QatarFiesta Logo" />
        </div>
        <div className={state===false ? "navbar-right" : "navbar1-right"}>
        <span className='menu' onClick={()=>setState(!state)}><GiHamburgerMenu />{console.log(state)}</span>
          <div className={state===false ? 'navbar-items' : "navbar1-items" }>
            <ul>
              <li>HOME</li>
              <li onClick={openEventsPage}>EVENTS</li>
              <li>CONTACT</li>
              <li>WISHLIST</li>
              <li>
                <button className='signup_btn' onClick={handleSubmitEvent}>SUBMIT EVENTS</button>
              </li>

                
            {data ? (
              <div>
              <li style={{color:'blue'}}>Hi, {data.name}</li>
              <li><div className='signup'>
              <button className='logout_btn' onClick={handleLogout}>Logout</button>
            </div>
            </li>
            </div>
            ) : (
              <li><div className='signup'>
            <Link to="login/">
              <button className='signup_btn'>Login/Register</button>
            </Link>
            </div>
            </li>
            )}
          
            </ul>
          </div>
         
        </div>
      </div>
    </div>
  );
}

export default Navbar;
