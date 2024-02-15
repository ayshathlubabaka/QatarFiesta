import React, { useState, useEffect } from 'react'
import Sidebar from "../../Components/Sidebar";
import "./CategoryManage.css";
import { useNavigate } from 'react-router-dom';

function CategoryManage() {

    const [name, setName] = useState('')
    const [data, setData] = useState([])
    const [isCreateModalOpen, setCreateModalOpen] = useState(false)
    const [isEditModalOpen, setEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [editedItem, setEditedItem] = useState({})
    const navigate = useNavigate('')
    const baseURL = process.env.REACT_APP_API_BASE_URL

    const fetchData = async (e) => {
        try{
            const response = await fetch(`${baseURL}/api/v1/admin/category/`)
            const result = await response.json();
            setData(result);
        }catch(error){
            console.error('Error fetching data', error)
        }
    };

    useEffect(() => {
        fetchData();
      }, []);

    const handleCreate = async(e) => {
        e.preventDefault();
        try {
            await fetch(`${baseURL}/api/v1/admin/category/`, {
                method:'POST',
                headers: {'Content-Type' :'application/json'},
                body: JSON.stringify({
                    name,
                  })
            });
            console.log('Created successfully')
            setCreateModalOpen(false)
            fetchData();
        }catch(error){
            console.log('Something went wrong, error')
        }
    }

    const handleEdit = async(e) => {
        e.preventDefault();
        try{
            await fetch(`${baseURL}/api/v1/admin/category-change/${selectedItemId}/`, {
                method: 'PUT',
                headers: {'Content-Type' :'application/json'},
                body: JSON.stringify({name})
            })
            console.log('Edited successfully')
            setEditModalOpen(false)
            fetchData();
        }catch(error){
            console.log('Cannot edit', error)
        }
    }

    const handleDelete = async(e) => {
        e.preventDefault();
        try {
            await fetch(`${baseURL}/api/v1/admin/category-change/${selectedItemId}/`, {
                method: 'DELETE',
                headers: {'Content-Type' :'application/json'},
                credentials: 'include',
            });
            console.log('Deleted successfully')
            setDeleteModalOpen(false)
            fetchData();
        }catch(error){
            console.log('Cannot delete', error)
        }
    }

    

  return (
    <div className="dashboard">
      <div className="row">
        <div className="col-2 sidebar">
          <Sidebar />
        </div>
        <div className="col-8 mt-3 header bg-light">
          <h2>Manage Category</h2>
          <nav className="navbar navbar-light">
            <div className="container-fluid">
              <button className="btn btn-success mt-2" onClick={() => setCreateModalOpen(true)}>
                Create category<i className="bi bi-plus"></i>
              </button>
            </div>
          </nav>

          <div className="table-border mt-5">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Category</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <th scope='row'>{item.id}</th>
                    <td>{item.name}</td>
                    <td>
                    <button className="btn btn-primary m-2" onClick={() => {setEditModalOpen(true); setSelectedItemId(item.id); setEditedItem(item)}}>Edit</button>
                    {isEditModalOpen && (
                        <div className="modal">
                        <div className="modal-content">
                        <span
                            className="close"
                            onClick={() => setEditModalOpen(false)}
                        >
                            &times;
                        </span>
                        <form>
                        <input
                            type="text"
                            className="category_input"
                            value={editedItem.name}
                            onChange={(e) => {setEditedItem({ ...editedItem, name: e.target.value }); setName(e.target.value)}}
                            />
                        <button onClick={handleEdit}>Update</button>
                        </form>
                        </div>
                    </div>
                    )}
                    <button className="btn btn-danger" onClick={() => {setDeleteModalOpen(true); setSelectedItemId(item.id)}}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      { isCreateModalOpen && (
        <div className="modal">
        <div className="modal-content">
          <span
            className="close"
            onClick={() => setCreateModalOpen(false)}
          >
            &times;
          </span>
          <form onSubmit={handleCreate}>
            <input
              type="text"
              className="category_input"
              placeholder="Category"
              onChange={(e) => setName(e.target.value)}
            />
            <button type="submit">Add</button>
          </form>
        </div>
      </div>
      )}
     
        {isDeleteModalOpen && (
        <div className="modal">
        <div className="modalContent">
        <span
            className="close"
            onClick={() => setDeleteModalOpen(false)}
        >
            &times;
        </span>
        <form onSubmit={(e) => handleDelete(e)}>
            <p>Are you really want to delete this item?</p>
            <button type='submit'>Delete</button>
        </form>
        </div>
    </div>
    )}
    </div>
  );
}

export default CategoryManage
