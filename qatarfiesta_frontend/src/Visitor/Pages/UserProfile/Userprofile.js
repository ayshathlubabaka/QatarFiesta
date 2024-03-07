import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { useAuth } from "../../AuthContext";

function Userprofile() {
  const [data, setData] = useState([]);

  const [profileData, setProfileData] = useState([]);

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [editprofileData, setEditProfileData] = useState(profileData);
  const baseURL = process.env.REACT_APP_API_BASE_URL;

  const { user } = useAuth();

  useEffect(() => {
    console.log("Authenticated user:", user);
    setData(user);
    console.log("userdata", user);
    fetchUserProfile();
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${baseURL}/api/v1/accounts/userprofile/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const data = await response.json();
      setProfileData(data);
      setEditProfileData(data);
    } catch (error) {
      console.error("profile fetch failed", error);
    }
  };
  const [formData, setFormData] = useState({
    phone_number: "",
    address: "",
    first_name: "",
    last_name: "",
    gender: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setEditProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${baseURL}/api/v1/accounts/userprofile/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(editprofileData),
      });
      console.log("Edited successfully");
      alert("Your profile is edited successfully");
      fetchUserProfile();
    } catch (error) {
      console.log("Something went wrong, error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch(`${baseURL}/api/v1/accounts/userprofile/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ ...formData, user: data.id }),
      });
      console.log("Created successfully");
      alert("Your profile is created successfully");
      setCreateModalOpen(false);
      fetchUserProfile();
    } catch (error) {
      console.log("Something went wrong, error");
    }
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <div>
        <Navbar />
      </div>
      <div className="row" style={{ marginTop: "100px" }}>
        <div className="col-md-2"></div>
        <div className="col-md-8">
          {profileData.length === 0 ? (
            <div>
              <h3>Please add your more details</h3>
              <div
                className="container mt-2"
                style={{ background: "whitesmoke" }}
              >
                <div className="mb-3">
                  <label htmlFor="first_name" className="form-label">
                    Given Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="first_name"
                    name="first_name"
                    value={data.name}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="first_name" className="form-label">
                    Email
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="first_name"
                    name="first_name"
                    value={data.email}
                  />
                </div>
              </div>
              <button onClick={() => setCreateModalOpen(true)}>
                Add profile
              </button>
            </div>
          ) : (
            <div
              className="container mt-2"
              style={{ background: "whitesmoke" }}
            >
              <h3>Your profile</h3>
              <form onSubmit={handleEdit}>
                <div className="mb-3">
                  <label htmlFor="first_name" className="form-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="first_name"
                    name="first_name"
                    value={editprofileData.first_name}
                    onChange={handleTextChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="last_name" className="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="last_name"
                    name="last_name"
                    value={editprofileData.last_name}
                    onChange={handleTextChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="first_name" className="form-label">
                    Given Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="first_name"
                    name="first_name"
                    value={data.name}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="first_name" className="form-label">
                    Email
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="first_name"
                    name="first_name"
                    value={data.email}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="gender" className="form-label">
                    Gender
                  </label>
                  <select
                    className="form-select"
                    id="gender"
                    name="gender"
                    value={editprofileData.gender}
                    onChange={handleTextChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="phone_number" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone_number"
                    name="phone_number"
                    value={editprofileData.phone_number}
                    onChange={handleTextChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <textarea
                    className="form-control"
                    id="address"
                    name="address"
                    value={editprofileData.address}
                    onChange={handleTextChange}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn"
                  style={{ background: "rgb(64, 64, 85)", color: "white" }}
                >
                  Edit Profile
                </button>
              </form>
            </div>
          )}
          {createModalOpen && (
            <div className="container mt-5">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="first_name" className="form-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="last_name" className="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="gender" className="form-label">
                    Gender
                  </label>
                  <select
                    className="form-select"
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="phone_number" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <textarea
                    className="form-control"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary">
                  Save Profile
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <div style={{ marginTop: "auto" }}>
        <Footer />
      </div>
    </div>
  );
}

export default Userprofile;
