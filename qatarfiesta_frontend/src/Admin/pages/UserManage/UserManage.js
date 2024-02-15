import React, {useState, useEffect} from 'react'
import './UserManage.css'
import Sidebar from '../../Components/Sidebar'
import { useNavigate } from 'react-router-dom';

function UserManage() {

  const [data, setData] = useState([])
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState('asc');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate('')
  const baseURL = process.env.REACT_APP_API_BASE_URL


  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleFilter = (type) => {
    setFilter(type);
  };

  const sortedData = data
    .filter((item) => (search.toLowerCase() === '' ? item : item.name.toLowerCase().includes(search)))
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


  const fetchData = async () => {
    try {
      const response = await fetch(`${baseURL}/api/v1/accounts/user-list/`)
      const result = await response.json();
      setData(result);
    } catch(error) {
      console.error('Error fetching data', error)
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      console.error('Something went error:', error);
    }
  }
  const unblock = async(ItemId) => {
    try {
      await fetch(`${baseURL}/api/v1/accounts/user-organizer-block/${ItemId}/`, {
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
            <div className='col-9 header bg-light'>
            <h2>Manage Users</h2>
            <nav className="navbar" style={{marginTop:"90px",marginLeft:"0px"}}>
  <div class="container mb-5">
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
  <button class="dropdown-item" onClick={() => handleFilter('blocked')}>blocked</button>
    <button class="dropdown-item" onClick={() => handleFilter('unblocked')}>unblocked</button>
    
  </ul>
</div>
  </div>
</nav>
        <div className='table-border' style={{marginTop:"100px"}}>
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

export default UserManage
