import { useState } from 'react';
import React from 'react'
import Sidebar from '../../Components/Sidebar/Sidebar'

function AddTicket() {

  const [ticketType, setTicketType] = useState('general');
  const [showAgeFields, setShowAgeFields] = useState(false);
  const [ageCategories, setAgeCategories] = useState([]);
  const [newAgeCategory, setNewAgeCategory] = useState('');
  const [newMinAge, setNewMinAge] = useState('');
  const [newMaxAge, setNewMaxAge] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [ticketTypeForPrice, setTicketTypeForPrice] = useState('general');
  const [ageForPrice, setAgeForPrice] = useState('adult');
  const [date, setDate] = useState('');
  const [totalTickets, setTotalTickets] = useState('');

  const handleTypeButtonClick = () => {
    // Handle logic for the "Type" button
    console.log('Type Button Clicked');
  };

  const handleAddAgeCategoryButtonClick = () => {
    // Handle logic for the "Add Age Category" button
    const newCategory = {
      name: newAgeCategory,
      minAge: newMinAge,
      maxAge: newMaxAge,
    };

    setAgeCategories((prevCategories) => [...prevCategories, newCategory]);
    setNewAgeCategory('');
    setNewMinAge('');
    setNewMaxAge('');
  };

  const handleTicketPriceButtonClick = () => {
    // Handle logic for the "Ticket Price" button
    console.log('Ticket Price Button Clicked');
  };

  const handleAddTicketButtonClick = () => {
    // Handle logic for the "Add Ticket" button
    console.log('Add Ticket Button Clicked');
  };
  return (
      <div className="header bg-light">
        <h4>Add Tickets</h4>
        <div className="table-border mt-2">
        <form>
        <div>
      {/* Type Field and Button */}
      <div className='row'>
      <div className="col-md-6 mb-3">
        <label htmlFor="ticketType">Type</label>
        <input
          type="text"
          className="form-control"
          id="ticketType"
          placeholder="Ticket Type"
          value={ticketType}
          onChange={(e) => setTicketType(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleTypeButtonClick}>
          Add Type
        </button>
      </div>

      {/* Age Category Field and Button */}
      <div className="col-md-6 mb-3">
          <>
            <label htmlFor="newAgeCategory">Age Group</label>
            <input
              type="text"
              className="form-control"
              id="newAgeCategory"
              placeholder="Group Name"
              value={newAgeCategory}
              onChange={(e) => setNewAgeCategory(e.target.value)}
            />
            <label htmlFor="newMinAge">Min Age</label>
            <input
              type="number"
              className="form-control"
              id="newMinAge"
              placeholder="Min Age"
              value={newMinAge}
              onChange={(e) => setNewMinAge(e.target.value)}
            />
            <label htmlFor="newMaxAge">Max Age</label>
            <input
              type="number"
              className="form-control"
              id="newMaxAge"
              placeholder="Max Age"
              value={newMaxAge}
              onChange={(e) => setNewMaxAge(e.target.value)}
            />
            <button className="btn btn-primary mt-2" onClick={handleAddAgeCategoryButtonClick}>
              Add Age Category
            </button>
          </>

      </div>
      </div>

      {/* Ticket Price Field and Button */}
      <div className='row'>
      <div className="col-md-6 mb-3">
        
        <label htmlFor="ticketTypeForPrice">Type</label>
        <select
          className="form-control"
          id="ticketTypeForPrice"
          value={ticketTypeForPrice}
          onChange={(e) => setTicketTypeForPrice(e.target.value)}
        >
          <option value="general">General</option>
          {/* Add more options as needed */}
        </select>
        <label htmlFor="ageForPrice">Age</label>
        <select
          className="form-control"
          id="ageForPrice"
          value={ageForPrice}
          onChange={(e) => setAgeForPrice(e.target.value)}
        >
          <option value="adult">Adult</option>
          {/* Add more options as needed */}
        </select>
        <label htmlFor="ticketPrice">Ticket Price</label>
        <input
          type="text"
          className="form-control"
          id="ticketPrice"
          placeholder="Ticket Price"
          value={ticketPrice}
          onChange={(e) => setTicketPrice(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleTicketPriceButtonClick}>
          Add Ticket Price
        </button>
      </div>

      {/* Add Ticket Fields and Button */}
      <div className='col-md-6'>
      <label htmlFor="ageForPrice">Date</label>
        <select
          className="form-control"
          id="ageForPrice"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        >
          <option value="adult">jan 1</option>
          <option value="adult">jan 2</option>
          {/* Add more options as needed */}
        </select>
        <label htmlFor="ageForPrice">Ticket Type</label>
        <select
          className="form-control"
          id="ageForPrice"
          value={ticketTypeForPrice}
          onChange={(e) => setTicketTypeForPrice(e.target.value)}
        >
          <option value="adult">VIP</option>
          <option value="adult">General</option>
          {/* Add more options as needed */}
        </select>
        <label htmlFor="ageForPrice">Age</label>
        <select
          className="form-control"
          id="ageForPrice"
          value={ageForPrice}
          onChange={(e) => setAgeForPrice(e.target.value)}
        >
          <option value="adult">Adult</option>
          {/* Add more options as needed */}
        </select>
        <label htmlFor="ticketPrice">Total Tickets</label>
        <input
          type="text"
          className="form-control"
          id="ticketPrice"
          placeholder="total Tickets"
          value={totalTickets}
          onChange={(e) => setTicketPrice(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleAddTicketButtonClick}>
          Add Ticket
        </button>
      </div>
      </div>
    </div>
    </form>
          </div>
        </div>
  )
}

export default AddTicket
