import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../Components/Sidebar/Sidebar";

function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState("");

  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

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

  const handleLogout = () => {
    setAccessToken(null);
    setRefreshToken(null);

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setData("");
    navigate("/");
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
        throw new Error("Request failed");
      }
      const data = await response.json();
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

  return (
    <div>
      {data.name ? (
        <div>
          <div className="container-fluid bg-white min-vh-100 dashboard">
            <div className="row">
              <div className="col-2 sidebar">
                <Sidebar />
              </div>
            </div>
          </div>
          <ul>
            <li style={{ color: "blue" }}>Hi, {data.name}</li>
            <li>
              <div className="signup">
                <button className="logout_btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </li>
          </ul>
        </div>
      ) : (
        navigate("/login/")
      )}
    </div>
  );
}

export default Home;
