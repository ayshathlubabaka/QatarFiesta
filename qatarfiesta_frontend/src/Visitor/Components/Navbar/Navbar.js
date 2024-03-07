import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { Dropdown } from "react-bootstrap";
import { Form, FormControl, Button } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useAuth } from "../../AuthContext";

const Navbar = ({ contactState = false, event_id = null }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  useEffect(() => {
    setData(user);
  }, [user]);

  const [state, setState] = useState(false);
  const [data, setData] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmitEvent = () => {
    const destinationURL = "/organizer/login/";

    window.location.href = destinationURL;
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    // setData('')
    setState(false);
    window.location.href = "/";
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    console.log(searchTerm);
  };

  const handleSubmitSearch = (event) => {
    event.preventDefault();
    navigate(`/events/?search=${searchTerm}`);
  };

  const openEventsPage = () => {
    navigate("/events/");
  };

  const openContact = () => {
    if (!data) {
      alert("login to contact");
    } else {
      navigate(`/contact/${event_id}`);
    }
  };

  return (
    <div>
      <div className={state === false ? "navbar2" : "navbar1"}>
        <div
          className="logo-container"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <img
            className="logo"
            src="../../../Image-1 (4).jpg"
            alt="QatarFiesta Logo"
            style={{ height: "50px", width: "170px" }}
          />
        </div>
        <div className={state === false ? "navbar2-right" : "navbar1-right"}>
          <span className="menu" onClick={() => setState(!state)}>
            <GiHamburgerMenu />
            {console.log(state)}
          </span>
          <div className={state === false ? "navbar2-items" : "navbar1-items"}>
            <ul style={{ cursor: "pointer" }}>
              <li onClick={() => navigate("/")}>HOME</li>
              <li onClick={openEventsPage}>EVENTS</li>
              {contactState && <li onClick={openContact}>CONTACT</li>}
              <li>
                <button className="signup_btn" onClick={handleSubmitEvent}>
                  SUBMIT EVENTS
                </button>
              </li>
              <li>
                <Form
                  inline
                  onSubmit={handleSubmitSearch}
                  className="d-flex align-items-center"
                >
                  <FormControl
                    type="text"
                    placeholder="Search"
                    className="mr-sm-2"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <Button
                    variant="outline-light"
                    className="ml-2"
                    type="submit"
                  >
                    <FaSearch />
                  </Button>
                </Form>
              </li>

              {data ? (
                <div>
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      {data.name}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="/profile/">Profile</Dropdown.Item>
                      <Dropdown.Item href="/my-booking/">
                        Bookings
                      </Dropdown.Item>
                      <Dropdown.Item href="/wallet/">Wallet</Dropdown.Item>
                      <Dropdown.Item>
                        <button className="logout_btn" onClick={handleLogout}>
                          Logout
                        </button>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              ) : (
                <li onClick={() => navigate("/login/")}>Login/Register</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
