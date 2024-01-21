import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/js/dist/dropdown'
import Sidebar from '../../Components/Sidebar'
import './Dashboard.css'
import { useNavigate } from 'react-router-dom';

function Dashboard() {

    const [data, setData] = useState('')
    const navigate = useNavigate();

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

  return (
    

    <div className='container-fluid bg-white min-vh-100 dashboard'>
      
      <div className='row'>
        <div className='col-2 sidebar'>
        <Sidebar
/>
        </div>
        <div className='col'>
        <div className='px-3'>
        <div className='container-fluid'>
            <div className='row g-3 my-2'>
                <div className='col-md-3'>
                    <div className='p-3 shadow-sm d-flex justify-content-around align-items-center rounded box'>
                        <div>
                            <h3 className='fs-2'>230 +</h3>
                            <p className='fs-5'>Events</p>
                        </div>
                        <i className='bi bi-cart-plus p-3 fs-1'></i>
                    </div>
                </div>
                <div className='col-md-3'>
                    <div className='p-3 shadow-sm d-flex justify-content-around align-items-center rounded box'>
                        <div>
                            <h3 className='fs-2'>230 +</h3>
                            <p className='fs-5'>Events</p>
                        </div>
                        <i className='bi bi-cart-plus p-3 fs-1'></i>
                    </div>
                </div>
                <div className='col-md-3'>
                    <div className='p-3 shadow-sm d-flex justify-content-around align-items-center rounded box'>
                        <div>
                            <h3 className='fs-2'>230 +</h3>
                            <p className='fs-5'>Events</p>
                        </div>
                        <i className='bi bi-cart-plus p-3 fs-1'></i>
                    </div>
                </div>
                <div className='col-md-3'>
                    <div className='p-3 shadow-sm d-flex justify-content-around align-items-center rounded box'>
                        <div>
                            <h3 className='fs-2'>230 +</h3>
                            <p className='fs-5'>Events</p>
                        </div>
                        <i className='bi bi-cart-plus p-3 fs-1'></i>
                    </div>
                </div>
            </div>
        </div>
        <div className='row'>
            <div className='col-6 mt-5'>
                <img style={{height:'400px'}} src='../../../pie chart.png' alt='pie-chart' />
            </div>
            <div className='col-6 mt-5'>
                <img style={{height:'400px'}} src='../../../barchart.png' alt='barchart' />
            </div>
        </div>
    </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
