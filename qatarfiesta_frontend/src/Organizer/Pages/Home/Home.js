import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../Components/Sidebar/Sidebar";
import OrgDashboard from "../OrgDasboard/OrgDashboard";
import CreateEvents from "../CreateEvents/CreateEvents";
import ManageEvent from "../ManageEvent/ManageEvent";

function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState("");

  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const [selectedMenu, setSelectedMenu] = useState(OrgDashboard);

  const handleTokenRefresh = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/accounts/api/token/refresh/",
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
        "http://127.0.0.1:8000/api/v1/accounts/organizer/",
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
        navigate('/organizer/');
      } else {
        alert('User is not an organizer')
        navigate('/organizer/login');
      }
      setData(data);
      console.log(data);
    } catch (error) {
      if (error.status === 401) {
        await handleTokenRefresh();
      }
    }
  };

  useEffect(() => {
    console.log("inside organizer home");
    fetchUser();
  }, [accessToken, refreshToken]);


  const handleMenuClick = (menu) => {
    setSelectedMenu(menu)
  }

  const homePageContent = () => {
    switch (selectedMenu) {
      case 'OrgDashboard':
        return <div><OrgDashboard /></div>
      case 'ManageEvent':
        return <div><ManageEvent /></div>
        case 'CreateEvents':
        return <div><CreateEvents organizerId={data.id}/></div>
      default:
        return <div><OrgDashboard /></div>
    }
  }

  return (
    <div>
    {data.name ? (
      <div className="container-fluid bg-white">
        <div className="row">
          <div className="col-2" style={{ height: '600px' }}>
            <Sidebar data={data} setData={setData} setAccessToken={setAccessToken} setRefreshToken={setRefreshToken} onMenuClick={handleMenuClick}/>
          </div>
          <div className="col-1"></div>
          <div className="col-8">
           {homePageContent()}
          </div>
        </div>
      </div>
    ) : (
      navigate("/organizer/login/", { replace: true })
    )}
  </div>
  );
}

export default Home;
