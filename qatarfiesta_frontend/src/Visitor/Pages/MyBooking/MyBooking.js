import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import { useAuth } from '../../AuthContext';

function MyBooking() {

    const [bookingData, setBookingData] = useState([])
    const [eventData, setEventData] = useState([])
    const [data, setData] = useState('')
    const [filter, setFilter] = useState('all')
    const navigate= useNavigate('')
    const {user} = useAuth()
    const baseURL = process.env.REACT_APP_API_BASE_URL

    useEffect(() => {
      setData(user)
    }, [user])

    const fetchBookingData = async() => {
      try{
        const response = await fetch(`${baseURL}/api/stripe/my-booking`, {
        method:"GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      if (!response.ok) {
        throw new Error('Request failed');
      }
      const data = await response.json();
      setBookingData(data)
        
    }catch(error){
        console.error('Error fetching data', error)
    }
    }

    const fetchEventData = async () => {
      try {
        const response = await fetch(`${baseURL}/api/v1/organizer/event/`)
        const result = await response.json();
        console.log('event data',result)
        setEventData(result)
      } catch(error) {
        console.error('Error fetching data', error)
      }
    };

    const handleCreditWallet = async(booking_id) => {
      try {
        const response = await fetch(`${baseURL}/api/stripe/credit-wallet/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            booking_id
          }),
        });
    
        if (!response.ok) {
          throw new Error('Wallet credit failed');
        }
    
        console.log('Credit successful');
      } catch (error) {
        console.error('Wallet debit failed', error);
      }
    }

    const handleCancel = async (booking_id) => {
      const isConfirmed = window.confirm('Are you sure you want to cancel this booking?');
      if (isConfirmed) {
        try {
          const response = await fetch(`${baseURL}/api/stripe/cancel-booking/${booking_id}/`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          });
    
          if (!response.ok) {
            throw new Error('Request failed');
          }
          else {
    
          console.log('Cancelled successfully');
          fetchBookingData();
          handleCreditWallet(booking_id);
          }
    
        } catch (error) {
          if (error.status === 401) {
            console.log(error);
          }
        }
      } else {
        console.log('Booking cancellation canceled');
      }
    };

    useEffect(() => {
        fetchBookingData();
        fetchEventData();
      },[]);

      const getEventTitle = (eventId) => {
        const event = eventData.find((event) => event.id === eventId);
        return event ? event.title : 'Unknown Event';
      };

      const handleViewEvent = (eventId) => {
        const event = eventData.find((event) => event.id === eventId);
        if (event && event.is_active === true) {
            navigate(`/view_event/${eventId}`);
        }
    };

      const filteredData = bookingData.filter((item) => {
          if (filter === 'all') {
            return true;
          } else if (filter === 'pending') {
            return item.status === 'pending';
          } else if (filter === 'complete') {
            return item.status === 'complete';
          } else if (filter === 'cancelled') {
            return item.status === 'cancelled';
          }
        })



  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
<div className="border border-dark" style={{margin:"100px", paddingTop:"20px"}}>
    <h2 className='mb-3'>My Bookings</h2>
    <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="complete">Complete</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>

    {filteredData.length === 0 ? (
      <p>No bookings available</p>
    ) : (
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Booking Id</th>
            <th>Booking Date</th>
            <th>Event</th>
            <th>Event Date</th>
            <th>Number of Tickets</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Cancel Booking</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((booking, index) => (
            <tr key={index}>
              <td>{booking.id}</td>
              <td>{booking.booking_date}</td>
              <td style={{fontWeight:"bolder", cursor:"pointer", color:"blue"}} onClick={() => handleViewEvent(booking.event)}>{getEventTitle(booking.event)}</td>
              <td>{booking.date}</td>
              <td>{booking.numTickets}</td>
              <td>{booking.totalPrice}</td>
              <td>{booking.status}</td>
              {booking.status === 'complete' ? (
                  <td><button className='btn btn-danger' onClick={() => handleCancel(booking.id)}>Cancel</button></td>
                ) : booking.status === 'pending' ? (
                  <td>Not Complete</td>
                ) : booking.status === 'cancelled' ? (
                  <td>Cancelled</td>
                ) : (
                  <td>Not complete</td>
                )}
              
            </tr>
          ))}
        </tbody>
      </table>
      
    )}
  </div>
  <div style={{ marginTop: 'auto' }}>
      <Footer />
    </div>
    </div>
    
  )
}

export default MyBooking
