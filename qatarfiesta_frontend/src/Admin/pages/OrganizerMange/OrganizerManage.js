import React, {useState, useEffect} from 'react'
import './OrganizerManage.css'
import Sidebar from '../../Components/Sidebar';

function OrganizerManage() {
  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('asc');
  const [filter, setFilter] = useState('all');
  const baseURL = process.env.REACT_APP_API_BASE_URL


  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleFilter = (type) => {
    setFilter(type);
  };

  const sortedData = data
    .filter((item) => (searchQuery.toLowerCase() === '' ? item : item.name.toLowerCase().includes(searchQuery)))
    .sort((a, b) => (sortOrder === 'asc' ? a.id - b.id : b.id - a.id))
    .filter((item) => {
      if (filter === 'all') {
        return true;
      } else {
        return item.is_active === (filter === 'unblocked');
      }
    })

  useEffect(() => {
    fetchData();
  }, []);


  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    console.log(searchQuery)
  }

  const fetchData = async () => {
    try {
      const response = await fetch(`${baseURL}/api/v1/accounts/organizer-list/`)
      const result = await response.json();
      setData(result);
    } catch(error) {
      console.error('Error fetching data', error)
    }
  };


  const block = async(ItemId) => {
    try {
      await fetch(`${baseURL}/api/v1/accounts/user-organizer-block/${ItemId}/`, {
        method: 'PATCH',
        headers: {'Content-Type' :'application/json'},
        credentials: 'include',
      });
     
      console.log('Blocked successfully');
      fetchData()
  
    } catch (error) {
      console.error('Something went wrong:', error);
    }
  }
  const unblock = async(ItemId) => {
    try {
      await fetch(`${baseURL}/api/v1/accounts/user-organizer-block/${ItemId}/`, {
        method: 'PUT',
        headers: {'Content-Type' :'application/json'},
        credentials: 'include',
      });
     
      console.log('Unblocked successfully');
      fetchData()
  
    } catch (error) {
      console.error('Some error occured:', error);
    }
  }

  

  return (
    <div className='dashboard'>
        <div className='row'>
            <div className='col-2 sidebar'>
                <Sidebar />
            </div>
            <div className='col-9 mt-3 header bg-light'>
            <h2>Manage Organizers</h2>
            <nav className="navbar" style={{marginTop:"100px", marginLeft:"0px"}}>
  <div className='container mb-5'>
    <form className="d-flex me-auto">
      <input className="form-control me-2" type="text" placeholder="Search" onChange={handleSearch} aria-label="Search" />
      <button className="btn btn-outline-success" type="submit"><i className='bi bi-search'></i></button>
    </form>
    <div className="dropdown ms-auto">
  <button className="btn btn-outline-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
    Sort
  </button>
  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
  <button class="dropdown-item" onClick={handleSort}>descending</button>
    <button class="dropdown-item" onClick={handleSort}>ascending</button>
    
  </ul>
</div>
<div className="dropdown">
  <button className="btn btn-outline-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
    Filter
  </button>
  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
  <button class="dropdown-item" onClick={() => handleFilter('all')}>All</button>
  <button class="dropdown-item" onClick={() => handleFilter('blocked')}>blocked</button>
    <button class="dropdown-item" onClick={() => handleFilter('unblocked')}>unblocked</button>
    
  </ul>
</div>
  </div>
</nav>
              
        <div className='table-border' style={{marginTop:"100px"}}>
      <table className="table">
  <thead>
    <tr>
      <th scope="col">Organizer Id</th>
      <th scope="col">Organization Name</th>
      <th scope="col">Email</th>
      <th scope="col">Status</th>
      <th scope="col">Action</th>
    </tr>
  </thead>
  <tbody>
    {sortedData.map((item) => (
      <tr key={item.id}>
      <th scope="row">{item.id}</th>
      <td>{item.name}</td>
      <td>{item.email}</td>
      <td>{item.is_active ? (
        'Active'
      ):(
        'Blocked'
      )}</td>
      <td>
        {item.is_active ? (
          <button className='btn btn-danger' onClick={() => block(item.id)}>Block</button>
        ):(
          <button className='btn btn-primary' onClick={() => unblock(item.id)}>Unblock</button>
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

export default OrganizerManage
