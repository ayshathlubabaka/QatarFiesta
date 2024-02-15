import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";

function OrderStatus() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const isPaymentCanceled = queryParams.get("canceled") === "true";
    const isSuccess = queryParams.get("success") === "true";
    const bookingId=queryParams.get("bookingId")

    const baseURL = process.env.REACT_APP_API_BASE_URL


    const handleBookingConfirm = async(e) => {
        try {
          const response = await fetch(`${baseURL}/api/stripe/confirm-booking/`, {
              method:'PUT',
              headers: {'Content-Type' :'application/json'},
                    body: JSON.stringify({
                        booking_id:bookingId,

                      })
          });
          if (response.ok) {
            const responseData = await response.json();
            console.log(responseData)
        } else {
            console.log('Failed to create checkout session');
        }
      }catch(error){
          console.log('Something went wrong, error')
      }
    }

    useEffect(() => {
        if (isPaymentCanceled) {
          console.log("Payment canceled");
        } else if (isSuccess) {
            handleBookingConfirm();
          console.log("Payment successful");
        } else {
          console.log("Unexpected order status");
        }
      }, [isPaymentCanceled, isSuccess]);

  return (
    <div className="text-center">
      {isPaymentCanceled && (
        <div>
      <h2>Order Canceled</h2>
      <Link
            to="/"
            className="mt-4 bg-customColorA font-serif text-dark px-4 py-2 rounded-lg"
          >
            Go to Home
          </Link>
          </div> )}
      {isSuccess && (
        <div className="flex flex-col items-center justify-center h-screen">
          <img
            src="https://i.pinimg.com/originals/32/b6/f2/32b6f2aeeb2d21c5a29382721cdc67f7.gif"
            alt="Payment Success GIF"
            className="w-64 h-60"
          />
          <h2 className="text-2xl font-semibold text-blue-300 font-serif">
            Payment Successfully Completed
          </h2>
          <Link
            to="/"
            className="mt-4 bg-customColorA font-serif text-dark px-4 py-2 rounded-lg"
          >
            Go to Home
          </Link>
        </div>
      )}
    </div>
  )
}

export default OrderStatus
