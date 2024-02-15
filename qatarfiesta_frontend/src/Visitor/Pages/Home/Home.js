import React, {useEffect, useState} from 'react'
import './Home.css'
import Navbar from '../../Components/Navbar/Navbar'
import Banner from '../../Components/Banner/Banner'
import Events from '../../Components/Events/Events'
import Footer from '../../Components/Footer/Footer'


function Home() {

  return (
    <div>
      <div className="navbar-container">
        <Navbar />
      </div>
      <div className="banner-container">
        <Banner />
      </div>
      <div className="">
        <Events />
      </div>
      <div className=''>
      <Footer />
      </div>
    </div>
  )
}

export default Home
