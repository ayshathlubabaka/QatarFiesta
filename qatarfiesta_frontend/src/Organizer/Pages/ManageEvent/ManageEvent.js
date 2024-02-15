import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { Table, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function ManageEvent() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const baseURL = process.env.REACT_APP_API_BASE_URL;

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleFilter = (type) => {
    setFilter(type);
  };

  const handleViewEvent = (event_id) => {
    navigate(`/organizer/view_event/${event_id}`);
  };

  const handleDelete = async (event_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (confirmDelete) {
      try {
        await fetch(`${baseURL}/api/v1/organizer/event-change/${event_id}/`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        console.log("Deleted successfully");
        fetchData();
      } catch (error) {
        console.error("Cannot delete", error);
      }
    } else {
      console.log("Deletion canceled");
    }
  };
  const handleEdit = (event_id) => {
    navigate(`/organizer/edit_event/${event_id}/`);
  };

  const sortedData = data
    .filter((item) =>
      search.toLowerCase() === ""
        ? item
        : item.title.toLowerCase().includes(search)
    )
    .sort((a, b) => (sortOrder === "asc" ? a.id - b.id : b.id - a.id))
    .filter((item) => {
      if (filter === "all") {
        return true;
      } else {
        return item.is_active === (filter === "approved");
      }
    });

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${baseURL}/api/v1/organizer/organizer-event/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row" style={{ height: "2rem" }}></div>
      <div className="row" style={{ height: "100%" }}>
        <div className="col-md-2" style={{ background: "rgb(226, 128, 47)" }}>
          <Sidebar />
        </div>
        <div className="col-md-10" style={{ height: "100%" }}>
          <div className="row mb-3" style={{ height: "10%" }}>
            <h3>Manage Events</h3>
          </div>
          <div className="row" style={{ height: "10%" }}>
            <div className="col-md-6">
              <form className="d-flex me-auto">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search"
                />
                <button className="btn btn-outline-success" type="submit">
                  <i className="bi bi-search"></i>
                </button>
              </form>
            </div>
            <div className="col-md-6 d-flex justify-content-end">
              <div className="col-md-3">
                <div className="dropdown">
                  <button
                    className="btn btn-outline-secondary dropdown-toggle"
                    type="button"
                    id="sortDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Sort
                  </button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton1"
                  >
                    <li>
                      <button className="dropdown-item" onClick={handleSort}>
                        Descending
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleSort}>
                        Ascending
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-3">
                <div className="dropdown">
                  <button
                    className="btn btn-outline-secondary dropdown-toggle"
                    type="button"
                    id="filterDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Filter
                  </button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="filterDropdown"
                  >
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => handleFilter("all")}
                      >
                        All
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => handleFilter("rejected")}
                      >
                        Not Approved
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => handleFilter("approved")}
                      >
                        Approved
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="row" style={{ height: "80%" }}>
            <div className="header bg-light mt-5">
              <div className="table-border mt-2 overflow-auto">
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>User Id</th>
                      <th>Name</th>
                      <th>Venue</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td
                          onClick={() => handleViewEvent(item.id)}
                          style={{ fontWeight: "bolder", cursor: "pointer" }}
                        >
                          {item.title}
                        </td>
                        <td>{item.venue}</td>
                        <td>{item.is_active ? "Approved" : "Rejected"}</td>
                        <td>
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </Button>
                          <Button
                            variant="primary"
                            onClick={() => handleEdit(item.id)}
                          >
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageEvent;
