import React, {useState, useEffect} from 'react'
import Sidebar from '../../Components/Sidebar'
import {useNavigate} from 'react-router-dom'

function PendingEvents() {
    const [data, setData] = useState([])
    const [search, setSearch] = useState('')
    const [sortOrder, setSortOrder] = useState('asc');
    const navigate = useNavigate()
    const [filter, setFilter] = useState('all');
  
    const handleSort = () => {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };
  
    const handleFilter = (type) => {
      setFilter(type);
    };

    const handleViewEvent = (event_id) => {
      navigate(`/admin/view_event/${event_id}`);
    }
  
    const sortedData = data
      .filter((item) => (search.toLowerCase() === '' ? item : item.name.toLowerCase().includes(search)))
      .sort((a, b) => (sortOrder === 'asc' ? a.id - b.id : b.id - a.id))
      .filter((item) => {
        if (filter === 'all') {
          return true;
        } else {
          return item.is_active === (filter === 'approved');
        }
      })

  
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/organizer/event/')
        const result = await response.json();
        setData(result);
      } catch(error) {
        console.error('Error fetching data', error)
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const approve= async(ItemId) => {
      try {
        await fetch(`http://127.0.0.1:8000/api/v1/admin/approve-event-request/${ItemId}/`, {
          method: 'PUT',
          headers: {'Content-Type' :'application/json'},
          credentials: 'include',
        });
       
        console.log('Blocked successfully');
        fetchData()
    
      } catch (error) {
        console.error('Something went error:', error);
      }
    }
    const reject = async(ItemId) => {
      try {
        await fetch(`http://127.0.0.1:8000/api/v1/admin/reject-event-request/${ItemId}/`, {
          method: 'PUT',
          headers: {'Content-Type' :'application/json'},
          credentials: 'include',
        });
       
        console.log('Unblockedsuccessfully');
        fetchData()
    
      } catch (error) {
        console.error('Something went error:', error);
      }
    }
  
    return (
      <div className='dashboard'>
          <div className='row'>
              <div className='col-2 sidebar'>
                  <Sidebar />
              </div>
              <div className='col-8 mt-3 header bg-light'>
              <h2>Manage Event Requests</h2>
                <nav class="navbar navbar-light">
    <div class="container-fluid">
      <form class="d-flex me-auto">
        <input class="form-control me-2" type="search" placeholder="Search" onChange={(e) => setSearch(e.target.value)} aria-label="Search" />
        <button class="btn btn-outline-success" type="submit"><i className='bi bi-search'></i></button>
      </form>
      <div class="dropdown ms-auto">
    <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
      Sort
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
    <button class="dropdown-item" onClick={handleSort}>descending</button>
      <button class="dropdown-item" onClick={handleSort}>ascending</button>
    </ul>
  </div>
  <div class="dropdown">
    <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
      Filter
    </button>
    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
    <button class="dropdown-item" onClick={() => handleFilter('all')}>All</button>
    <button class="dropdown-item" onClick={() => handleFilter('rejected')}>Not Approved</button>
      <button class="dropdown-item" onClick={() => handleFilter('approved')}>Approved</button>
      
    </ul>
  </div>
    </div>
  </nav>
          <div className='table-border mt-2'>
        <table class="table">
    <thead>
      <tr>
        <th scope="col">User Id</th>
        <th scope="col">Name</th>
        <th scope="col">Email</th>
        <th scope="col">Status</th>
        <th scope="col">Action</th>
      </tr>
    </thead>
    <tbody>
      {sortedData.map((item) => (
        <tr key={item.id}>
        <th scope="row">{item.id}</th>
        <td onClick={() => handleViewEvent(item.id)}>{item.title}</td>
        <td>{item.venue}</td>
        <td>{item.is_active ? (
          'Approved'
        ):(
          'Rejected'
        )}</td>
        <td>
          {item.is_active ? (
            <button className='btn btn-danger' onClick={() => reject(item.id)}>Reject</button>
          ):(
            <button className='btn btn-primary' onClick={() => approve(item.id)}>Approve</button>
          )}
          </td>
      </tr>
      ))}
      
    </tbody>
  </table>
      </div>
      </div>
      </div>
      </div>
    )
  }

export default PendingEvents
