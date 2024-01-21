import React, {useEffect, useState} from 'react'
import './Home.css'
import Navbar from '../../Components/Navbar/Navbar'
import Banner from '../../Components/Banner/Banner'
import Events from '../../Components/Events/Events'
import Footer from '../../Components/Footer/Footer'


function Home() {

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

  

  useEffect(() => {
    fetchUser();
  }, [accessToken, refreshToken]);

 

  return (
    <div>
      <div className="navbar-container">
        <Navbar data={data} setData={setData} accessToken={accessToken} setAccessToken={setAccessToken} setRefreshToken={setRefreshToken} />
      </div>
      <div className="banner-container">
        <Banner />
      </div>
      <div className="">
        <Events />
      </div>
      <div className=''>
      <Footer />
      </div>
    </div>
  )
}

export default Home