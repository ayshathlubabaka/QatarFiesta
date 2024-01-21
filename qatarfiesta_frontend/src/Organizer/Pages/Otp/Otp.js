import React, {useState} from 'react'
import '../Login/Login.css'
import {useNavigate} from 'react-router-dom'

function Otp() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')

    const submit = async(e) => {
        e.preventDefault();
        try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/accounts/verify-otp/', {
        method: 'POST',
        headers: {'Content-Type' :'application/json'},
        body: JSON.stringify({
           email,
           otp
        })
        });
        if (response.ok){
            alert('Registration successfull, Login now !')
            navigate('/organizer/login/')
          } else {
            alert('Enter valid Email and Otp')
          }
          } catch (error) {
            alert('Error during registration!', error)
          }
    }
    
    
  return (
    <div>
      <div>
        <div className='navbar'>
        <div className="logo-container">
        <div className='login_header'><h1></h1></div>
            <a href='/'><img className="logo" src="../../../Image-1 (4).jpg" alt="Qatarfiesta Logo" /></a>
        </div>
        </div>
        <div className='banner'>
        <div className='login_container'>
        <div className='login_header'><h1>Enter Otp</h1></div>
            <form onSubmit={submit}>
                <p style={{color:'brown'}}>To complete registration an otp is sent to your email. Enter otp here.</p>
            <input type='email' className='login_input' placeholder='Enter your email' onChange={e => setEmail(e.target.value) }/>
            <input type='text' className='login_input' placeholder='Enter your Otp' onChange={e => setOtp(e.target.value) }/>
            <button className='submit_btn'>Submit</button>
            </form>
        </div>
        <div className="fade_bottom"></div>
    </div>
    </div>
    </div>
  )
}

export default Otp
