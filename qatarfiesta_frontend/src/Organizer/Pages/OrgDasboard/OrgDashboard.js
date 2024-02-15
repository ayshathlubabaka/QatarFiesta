import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../../Components/Sidebar/Sidebar';
import {Chart} from 'chart.js/auto'

function OrgDashboard() {

  const [categoryData, setCategoryList] = useState([]);
    const [eventData, setEventList] = useState([]);
    const [bookingData, setBookingList] = useState([]);
    const baseURL = process.env.REACT_APP_API_BASE_URL

    const pieChartRef = useRef(null);
    const barChartRef = useRef(null);

    const fetchCategoryList = async (e) => {
      try{
          const response = await fetch(`${baseURL}/api/v1/admin/category/`)
          const result = await response.json();
          setCategoryList(result);
      }catch(error){
          console.error('Error fetching data', error)
      }
    };
  
    const fetchEventList = async () => {
      try {
        const response = await fetch(`${baseURL}/api/v1/organizer/organizer-event/`, {
          method:"GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
        const result = await response.json();
        setEventList(result)
      } catch(error) {
        console.error('Error fetching data', error)
      }
    };
  
    const fetchBookingList = async() => {
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
      setBookingList(data)
      console.log(data)
    }catch(error){
        console.error('Error fetching data', error)
    }
    }
  
    useEffect(() => {
      if (pieChartRef.current && eventData.length > 0 && categoryData.length > 0) {
        const eventsByCategory = {};
        eventData.forEach(event => {
          const categoryId = event.category;
          if (!eventsByCategory[categoryId]) {
            eventsByCategory[categoryId] = 0;
          }
          eventsByCategory[categoryId]++;
        });
  
        const labels = [];
        const data = [];
        categoryData.forEach(category => {
          const categoryId = category.id;
          const categoryName = category.name;
          labels.push(categoryName);
          data.push(eventsByCategory[categoryId] || 0);
        });
  
        const ctx = pieChartRef.current.getContext('2d');
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              data: data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
              ],
            }],
          },
        });
      }
    }, [eventData, categoryData]);
  
    useEffect(() => {
      if (barChartRef.current && bookingData.length > 0 && eventData.length > 0) {
        const eventNames = eventData.map(event => event.title);
        const bookings = eventData.map(event => {
          const eventBookings = bookingData.filter(booking => booking.event === event.id);
          return eventBookings.length;
        });
  
        const ctx = barChartRef.current.getContext('2d');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: eventNames,
            datasets: [{
              label: 'Number of Bookings',
              data: bookings,
              backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue color for bars
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true, // Start y-axis at zero
              },
            },
          },
        });
      }
    }, [bookingData, eventData]);
  
      useEffect(() => {
        fetchCategoryList();
        fetchEventList();
        fetchBookingList();
      }, []);
  

  return (
    <div className='container-fluid'>
      
      <div className='row'>
        <div className='col-2 sidebar'>
        <Sidebar />
        </div>
        <div className='col-9'>
        <div className='px-3'>
        <div className='container-fluid'>
            <div className='row g-3 my-2'>
                <div className='col-md-6'>
                    <div className='p-3 shadow-sm d-flex justify-content-around align-items-center rounded box'>
                        <div>
                            <h3 className='fs-2'>{eventData.length} +</h3>
                            <p className='fs-5'>Events</p>
                        </div>
                        <i className='bi bi-cart-plus p-3 fs-1'></i>
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='p-3 shadow-sm d-flex justify-content-around align-items-center rounded box'>
                        <div>
                            <h3 className='fs-2'>{bookingData.length} +</h3>
                            <p className='fs-5'>Bookings</p>
                        </div>
                        <i className='bi bi-cart-plus p-3 fs-1'></i>
                    </div>
                </div>
            </div>
        </div>
        <div className='row'>
            <div className='col-6' style={{ width: '400px', height: '400px' }} >
            <canvas ref={pieChartRef} />
            </div>
            <div className='col-6'style={{ width: '600px', height: '400px' }} >
            <canvas ref={barChartRef}></canvas>
            </div>
        </div>
    </div>
        </div>
      </div>
    </div>
  )
}

export default OrgDashboard
