import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QueryString from "query-string";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

function Payment() {
  const location = useLocation();
  const { bookingDetails } = location.state;
  const {
    bookingId,
    eventId,
    selectedDate,
    numTickets,
    visitorNames,
    totalPrice,
    user,
  } = bookingDetails;
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [walletData, setWalletData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
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
      const response = await fetch(`${baseURL}/api/v1/accounts/user/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Request failed");
      }
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      if (error.status === 401) {
        await handleTokenRefresh();
        await fetchUser();
      }
    }
  };

  const fetchWalletData = async () => {
    try {
      const response = await fetch(`${baseURL}/api/stripe/wallet/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Request failed");
      }
      const data = await response.json();
      setWalletData(data);
    } catch (error) {
      if (error.status === 401) {
        await handleTokenRefresh();
        await fetchUser();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${baseURL}/api/stripe/create-checkout-session/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            booking_id: bookingId,
          }),
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        const checkoutSessionUrl = responseData.session_url;
        window.location.href = checkoutSessionUrl;
      } else {
        console.log("Failed to create checkout session");
      }
    } catch (error) {
      console.log("Something went wrong, error");
    }
  };

  const handleCheckout = () => {
    setConfirmModalOpen(true);
  };

  const handleCheckoutConfirm = async () => {
    try {
      const response = await fetch(`${baseURL}/api/stripe/debit-wallet/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id: eventId,
          amount: totalPrice,
          bookingId: bookingId,
        }),
      });

      if (!response.ok) {
        throw new Error("Wallet debit failed");
      }

      console.log("Payment successful");
      navigate(`/order-status/?success=true&bookingId=${bookingId}`);
    } catch (error) {
      console.error("Wallet debit failed", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchWalletData();
  }, []);

  return (
    <div className="">
      <Navbar />
      <section style={{ margin: "100px", marginBottom: "180px" }}>
        <div className="row">
          <div className="col-md-8">
            <form onSubmit={handleSubmit}>
              <div className="card">
                <div className="card-body">
                  <h3>Booking details</h3>
                  <h5 className="card-title">{eventId.title}</h5>
                  <p className="card-text">Date: {selectedDate}</p>
                  <p className="card-text">Visitors:</p>
                  <ul className="list-group">
                    {visitorNames.map((name, index) => (
                      <li key={index} className="list-group-item">
                        {name}
                      </li>
                    ))}
                  </ul>
                  <p className="card-text">Number of tickets: {numTickets}</p>
                  <p className="card-text">Ticket Price: {totalPrice}</p>
                </div>
                <div className="card-footer">
                  <button type="submit" className="btn btn-dark">
                    Checkout Using Stripe
                  </button>
                </div>
              </div>
            </form>
          </div>
          {/* Wallet section */}
          <div className="col-md-4">
            {walletData ? (
              <div>
                <h3>Wallet Balance:{walletData.balance} </h3>

                <button
                  className="btn btn-success"
                  onClick={() => handleCheckout()}
                  disabled={walletData.balance < totalPrice}
                >
                  Pay with Wallet
                </button>
                {confirmModalOpen && (
                  <div className="mt-5 border border-dark p-3">
                    <h5>Click here to confirm payment using wallet.</h5>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleCheckoutConfirm()}
                    >
                      Confirm
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p>Loading wallet data...</p>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Payment;
