import React, { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const baseURL = process.env.REACT_APP_API_BASE_URL;

  const submit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${baseURL}/api/v1/accounts/forgot-password/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
          }),
        }
      );
      if (response.ok) {
        alert("check your Email");
        setEmail("");
      } else {
        alert("Enter valid Email");
      }
    } catch (error) {
      alert("Error!", error);
    }
  };

  return (
    <div>
      <div>
        <div className="navbar">
          <div className="logo-container">
            <div className="login_header">
              <h1></h1>
            </div>
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
              <h5>Enter your Email to reset your password</h5>
            </div>
            <form onSubmit={submit}>
              <input
                type="email"
                className="login_input"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />

              <button className="submit_btn">Submit</button>
            </form>
          </div>
          <div className="fade_bottom"></div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
