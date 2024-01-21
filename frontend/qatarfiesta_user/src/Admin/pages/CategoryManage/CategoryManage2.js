import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import "./CategoryManage.css";

function CategoryManage() {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editedItem, setEditedItem] = useState({})

  useEffect(() => {
    fetchData();
  }, [name]);


  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/admin/category/",{
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const submit = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/admin/category/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
          }),
        }
      );
      if (response.ok) {
        console.log("added successfully");
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log("error");
    }
  };

  const handleEditChange = (e) => {
    const {name, value} = e.target;
    setEditedItem({editedItem, [name]:value})
  }

  const handleUpdateItem = async (CategoryId) => {
    try {
      console.log(CategoryId)
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/admin/category-change/${CategoryId}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editedItem),
        }
      );
      if (response.ok) {
        console.log("edited successfully");
        setEditModalOpen(false);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log("error");
    }
  };

  const deleteItem = async (CategoryId) => {
    try {
      console.log(CategoryId)
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/admin/category-change/${CategoryId}/`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.ok) {
        console.log("deleted successfully");
        setDeleteModalOpen(false);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log("error");
    }
  };

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
              <button
                className="btn btn-success ms-auto"
                onClick={() => setCreateModalOpen(true)}
              >
                Create category<i className="bi bi-plus"></i>
              </button>
              {isCreateModalOpen && (
                <div className="modal">
                  <div className="modal-content">
                    <span
                      className="close"
                      onClick={() => setCreateModalOpen(false)}
                    >
                      &times;
                    </span>
                    <form onSubmit={submit}>
                      <input
                        type="text"
                        className="category_input"
                        placeholder="Category"
                        onChange={(e) => setName(e.target.value)}
                      />
                      <button className="add-btn" type="submit">Add</button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="table-border mt-2">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Category</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.is_active ? "Valid" : "Invalid"}</td>
                    <td>
                    <button
                    className="btn btn-primary m-2"
                    onClick={() => {
                      setEditedItem(item);
                      setEditModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                      {isEditModalOpen && (
                        <div className="modal">
                          <div className="modal-content">
                            <span
                              className="close"
                              onClick={() => setEditModalOpen(false)}
                            >
                              &times;
                            </span>
                            <form onSubmit={() => handleUpdateItem(item.id)}>
                              <input
                                type="text"
                                className="category_input"
                                value={editedItem.name}
                                onChange={handleEditChange}
                              />
                            <button className="add-btn" type="submit">Add</button>
                            </form>
                          </div>
                        </div>
                      )}
                      <button
                        className="btn btn-danger"
                        onClick={() => {setEditedItem(item);  setDeleteModalOpen(true)}}
                      >
                        Delete
                      </button>
                      {isDeleteModalOpen && (
                        <div className="modal">
                          <div className="modalContent">
                            <span
                              className="close"
                              onClick={() => setDeleteModalOpen(false)}
                            >
                              &times;
                            </span>
                            <form onSubmit={() => deleteItem(editedItem.id)}>
                              <p>Are you really want to delete this item?</p>
                              <button type="submit">Delete</button>
                            </form>
                          </div>
                        </div>
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
  );
}

export default CategoryManage;
