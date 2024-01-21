import React from 'react';
import './Banner.css';

function Banner() {
  return (
    <div>
      <div className='banner'>
        <div className='content'>
          <p className='description'>Discover, Book and Experience <br />The Best Events in One Place</p>
          <div className="input-container">
            <input type="text" className="transparent-input" placeholder="Search Events" />
            <button className="custom-button"><img className='search_img' src="https://cdn-icons-png.flaticon.com/256/3917/3917132.png" /></button>
          </div>
        </div>
        {/* <div className="fade_bottom"></div> */}
      </div>
      <div className='gray'></div>
    </div>
  );
}

export default Banner;