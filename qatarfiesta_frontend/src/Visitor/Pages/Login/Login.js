import React, { useEffect, useHistory, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const submit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseURL}/api/v1/accounts/api/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        const { access, refresh } = await response.json();

        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);

        const redirectUrl = localStorage.getItem("redirect_url") || "/";
        localStorage.removeItem("redirect_url");
        window.location.replace(redirectUrl);
      } else {
        alert("Please enter valid credentials!");
      }
    } catch (error) {
      alert("Error during login!", error);
    }
  };

  const handleSignInWithGoogle = async (response) => {
    try {
      console.log(response);
      const payload = response.credential;
      const serverRes = await fetch(`${baseURL}/api/v1/accounts/google/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          access_token: payload,
        }),
      });

      if (!serverRes.ok) {
        throw new Error(`HTTP error! Status: ${serverRes.status}`);
      }

      const serverData = await serverRes.json();
      console.log("Server Response:", serverData);
      const access = serverData.access_token;
      const refresh = serverData.refresh_token;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      const redirectUrl = localStorage.getItem("redirect_url") || "/";
      localStorage.removeItem("redirect_url");
      window.location.replace(redirectUrl);
    } catch (error) {
      console.error("Error during Google Sign-In:", error.message);
    }
  };

  useEffect(() => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleSignInWithGoogle,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("signInDiv"),
        {
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "circle",
          width: "280",
        }
      );
    } else {
      console.error("Google API library not loaded");
    }
  }, []);

  return (
    <div>
      <div>
        <div className="navbar">
          <div className="logo-container">
            <a href="/">
              <img
                className="logo"
                src="../../../Image-1 (4).jpg"
                alt="Qatarfiesta Logo"
              />
            </a>
          </div>
        </div>
        <div className="banner">
          <div className="login_container">
            <div className="login_header">
              <h1>Sign In</h1>
            </div>
            <div>
              <form onSubmit={submit}>
                <input
                  type="email"
                  className="login_input"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  className="login_input"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="submit_btn">Sign In</button>
                <div className="checkbox-container">
                  <a href="/forgot-password/" className="checkbox-link">
                    {" "}
                    Forgot Password?
                  </a>
                </div>
              </form>
            </div>
            <div className="login_footer">
              <span>
                New to QatarFiesta? <a href="/Register">Sign up now</a>
              </span>
            </div>
            <div className="googleContainer mt-2" id="signInDiv"></div>
          </div>
          <div className="fade_bottom"></div>
        </div>
      </div>
    </div>
  );
}

export default Login;
