import React, { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const baseURL = process.env.REACT_APP_API_BASE_URL;

  const submit = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      alert("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      alert("Passwords must be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch(
        `${baseURL}/api/v1/accounts/user/register/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
            password2,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setName("");
        setEmail("");
        setPassword("");
        setPassword2("");
        alert(
          "Please check your email and enter the OTP to complete the registration."
        );
        navigate("/otp/");
      } else {
        alert(data.errors);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Error during registration. Please try again later.");
    }
  };

  return (
    <div>
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
            <div className="signin_container">
              <div className="signin_header">
                <h1>Register</h1>
              </div>
              <div>
                <form onSubmit={submit}>
                  <input
                    type="text"
                    className="signin_input"
                    placeholder="Full Name"
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    type="email"
                    className="signin_input"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type="password"
                    className="signin_input"
                    placeholder="Password(Minimum 6 characters)"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    className="signin_input"
                    placeholder="Confirm Password"
                    onChange={(e) => setPassword2(e.target.value)}
                  />
                  <button className="submit_btn">Register</button>
                </form>
              </div>
              <div className="signin_footer">
                <span>
                  Already have an account? <a href="/Login">Login</a>
                </span>
              </div>
              {/* <button className='gmail_btn'>Login with Google<img className='google_logo' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8RNBvTz5BDnRJGaA2JPSiwevgjGTgVXO5ew&usqp=CAU' /></button>
            <button className='facebook_btn'>Login with Facebook <img className='facebook_logo' src='https://png.pngtree.com/png-vector/20221018/ourmid/pngtree-facebook-social-media-icon-png-image_6315968.png' /> </button> */}
            </div>
            <div className="fade_bottom"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
