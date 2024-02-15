import React from 'react';
import './Banner.css';

function Banner() {
  return (
    <div>
      <div className='banner'>
        <div className='content'>
          <p className='description'>Discover, Book and Experience <br />The Best Events in One Place</p>
        </div>
        {/* <div className="fade_bottom"></div> */}
      </div>
      <div className='gray'></div>
    </div>
  );
}

export default Banner;