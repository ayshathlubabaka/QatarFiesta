import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import "./Wallet.css";

function Wallet() {
  const [walletData, setWalletData] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const baseURL = process.env.REACT_APP_API_BASE_URL;

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
        console.log(error);
      }
    }
  };

  const fetchTransactionData = async () => {
    try {
      const response = await fetch(
        `${baseURL}/api/stripe/transaction/`,
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
      setTransactionData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWalletData();
    fetchTransactionData();
  }, []);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Navbar />
      <div className="row" style={{ margin: "100px" }}>
        <div className="col-md-2"></div>
        <div className="col-md-8">
          {walletData ? (
            <div
              className="row"
              style={{ background: "#ffd7b5", color: "#ff6700" }}
            >
              <h2>Balance: {walletData.balance}</h2>
              <p>Current QatarFiesta wallet balance</p>
            </div>
          ) : (
            <p>Loading wallet data...</p>
          )}

          <div className="row mt-5">
            <h5>All Transaction Details</h5>
            <div className="border border-dark mt-3">
              <table className="table">
                <thead>
                  <tr className="table-heading">
                    <th style={{ background: "#2b495f", color: "white" }}>
                      Date
                    </th>
                    <th style={{ background: "#2b495f", color: "white" }}>
                      Type
                    </th>
                    <th style={{ background: "#2b495f", color: "white" }}>
                      Amount
                    </th>
                    {/* <th style={{ background: '#2b495f', color: 'white' }}>Event</th> */}
                  </tr>
                </thead>
                <tbody>
                  {transactionData.map((transaction, index) => (
                    <tr key={index}>
                      <td>{transaction.timestamp}</td>
                      <td>{transaction.transaction_type}</td>
                      <td>{transaction.amount}</td>
                      {/* <td>{transaction.event_title}</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "auto" }}>
        <Footer />
      </div>
    </div>
  );
}

export default Wallet;
