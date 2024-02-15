import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";

function Messages() {
  const [data, setData] = useState("");
  const [id, setId] = useState("");
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [pendingChats, setPendingChats] = useState([]);
  const navigate = useNavigate("");
  const baseURL = process.env.REACT_APP_API_BASE_URL;

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
      const response = await fetch(`${baseURL}/api/v1/accounts/organizer/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (!response.ok) {
        navigate("/organizer/login/");
        throw new Error("Request failed");
      }
      const userData = await response.json();
      setData(userData);
      console.log(userData);
      setId(userData.id);
      fetchPendingChats();
    } catch (error) {
      if (error.status === 401) {
        await handleTokenRefresh();
        await fetchUser();
      }
    }
  };

  const fetchPendingChats = async () => {
    try {
      const response = await fetch(`${baseURL}/api/chat/pending-chats/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const data = await response.json();
      console.log("pending chats", data);
      setPendingChats(data);
    } catch (error) {
      console.error("Error fetching pending chats:", error);
    }
  };

  const handleLinkClick = async (chatId, chatUrl) => {
    console.log("link clicked");
    localStorage.setItem("chatUrl", chatUrl);
    try {
      const response = await fetch(
        `${baseURL}/api/chat/delete-url/${chatId}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete URL");
      }
      const storedChatUrl = localStorage.getItem("chatUrl");
      localStorage.removeItem("chatUrl");
      window.location.replace(storedChatUrl);
    } catch (error) {
      console.error("Error deleting URL:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="row container-fluid">
      <div className="col-2 sidebar">
        <Sidebar />
      </div>
      <div className="col-8">
        <h2>Pending Chats</h2>
        {pendingChats.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Organizer Name</th>
                <th>Username</th>
                <th>Chat Link</th>
              </tr>
            </thead>
            <tbody>
              {pendingChats.map((chat) => (
                <tr key={chat.id}>
                  <td>{chat.event}</td>
                  <td>{chat.reciever}</td>
                  <td>{chat.user}</td>
                  <td>
                    <a onClick={() => handleLinkClick(chat.id, chat.chat_url)}>
                      {chat.chat_url}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>
            <img
              src="https://assets-v2.lottiefiles.com/a/92920ca4-1174-11ee-9d90-63f3a87b4e3d/c6NYERU5De.png"
              alt="No data available"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
