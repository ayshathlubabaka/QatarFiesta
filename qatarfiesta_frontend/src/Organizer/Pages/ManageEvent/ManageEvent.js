import React, {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";

function ManageEvent() {

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
      navigate(`/organizer/view_event/${event_id}`);
    }

    const handleDelete = async (event_id) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this item?");
      
      if (confirmDelete) {
        try {
          await fetch(`http://127.0.0.1:8000/api/v1/organizer/event-change/${event_id}/`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });
    
          console.log('Deleted successfully');
          fetchData();
        } catch (error) {
          console.error('Cannot delete', error);
        }
      } else {
        console.log('Deletion canceled');
      }
    };
    const handleEdit = (event_id) => {
      navigate(`/organizer/edit_event/${event_id}/`)
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

  return (
    <div className="">
  <div className='row'>
    <div className='col-8'>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <form className="d-flex me-auto">
            <input className="form-control me-2" type="search" placeholder="Search" onChange={(e) => setSearch(e.target.value)} aria-label="Search" />
            <button className="btn btn-outline-success" type="submit"><i className='bi bi-search'></i></button>
          </form>
          <div className="dropdown ms-auto">
            <button className="btn btn-outline-secondary dropdown-toggle" type="button" id="sortDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              Sort
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
<button class="dropdown-item" onClick={handleSort}>descending</button>
<button class="dropdown-item" onClick={handleSort}>ascending</button>
</ul>
          </div>
          <div className="dropdown">
            <button className="btn btn-outline-secondary dropdown-toggle" type="button" id="filterDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              Filter
            </button>
            <ul className="dropdown-menu" aria-labelledby="filterDropdown">
              <button className="dropdown-item" onClick={() => handleFilter('all')}>All</button>
              <button className="dropdown-item" onClick={() => handleFilter('rejected')}>Not Approved</button>
              <button className="dropdown-item" onClick={() => handleFilter('approved')}>Approved</button>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </div>
  <div className='row mt-3'>
    <div className='col-12'>
      <div className='header bg-light mt-5'>
        <h2>Manage Event Requests</h2>
        <div className='table-border mt-2'>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">User Id</th>
                <th scope="col">Name</th>
                <th scope="col">Venue</th>
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
                  <td>{item.is_active ? 'Approved' : 'Rejected'}</td>
                  <td>
                    <button className='btn btn-danger' onClick={() => handleDelete(item.id)}>Delete</button>
                    <button className='btn btn-primary' onClick={() => handleEdit(item.id)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
  )
}

export default ManageEvent
