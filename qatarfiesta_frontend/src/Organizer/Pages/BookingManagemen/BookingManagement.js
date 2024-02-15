import React, {useState, useEffect} from 'react'
import { Container, Row, Col, Table } from 'react-bootstrap';
import Sidebar from '../../Components/Sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';

function BookingManagement() {

const [eventData, setEventData] = useState([])
const [bookingData, setBookingData] = useState([])
const [filter, setFilter] = useState('all')
const navigate= useNavigate('')
const baseURL = process.env.REACT_APP_API_BASE_URL

const fetchBookingData = async() => {
    try{
      const response = await fetch(`${baseURL}/api/v1/organizer/booking/`, {
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
    console.log(data)
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

  const handleCancel = async (booking_id) => {
    // Display confirmation prompt
    const isConfirmed = window.confirm('Are you sure you want to cancel this booking?');
  
    // Check if the user clicked "OK"
    if (isConfirmed) {
      try {
        const response = await fetch(`${baseURL}/api/v1/organizer/cancel-booking/${booking_id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Request failed');
        }
  
        console.log('Cancelled successfully');
        fetchBookingData();
        handleCreditWallet(booking_id);
  
      } catch (error) {
        if (error.status === 401) {
          console.log(error);
        }
      }
    } else {
      // User clicked "Cancel" in the prompt
      console.log('Booking cancellation canceled');
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

  useEffect(() => {
      fetchBookingData();
      fetchEventData();
    },[]);

    const getEventTitle = (eventId) => {
      const event = eventData.find((event) => event.id === eventId);
      return event ? event.title : 'Unknown Event';
    };

  return (
    <Container fluid>
        <div className='row' style={{height:"2rem"}}>
      </div>
 <Row>
        <Col md={2}>
          <Sidebar />
        </Col>
        <Col md={9} className="booking-content">
          <h4>Booking Management</h4>
        <div className='row' style={{height:"2rem"}}>
          <div className='col-md-6'>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="complete">Complete</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      </div>
      { bookingData.length >0 ? (

          <Table striped bordered hover>
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
              {bookingData.map((booking) => (
                <tr key={booking.id}>
                   <td>{booking.id}</td>
              <td>{booking.booking_date}</td>
              <td style={{fontWeight:"bolder", cursor:"pointer", color:"blue"}} onClick={()=>navigate(`/organizer/view_event/${booking.event}/`)}>{getEventTitle(booking.event)}</td>
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
          </Table>
      ) : (
        <div>
        <img src='https://assets-v2.lottiefiles.com/a/92920ca4-1174-11ee-9d90-63f3a87b4e3d/c6NYERU5De.png' alt='No data available' />
      </div>
      )}
        </Col>
      </Row>
    </Container>
  )
}

export default BookingManagement
