import React, {useState} from 'react'
import './Register.css'
import {useNavigate} from 'react-router-dom'

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('')
  const baseURL = process.env.REACT_APP_API_BASE_URL

  const submit = async(e) => {
    e.preventDefault();

    if (password !== password2) {
      alert('Passwords do not match')
      return;
    }
  
    try {
    const response = await fetch(`${baseURL}/api/v1/accounts/organizer/register/`, {
      method: 'POST',
      headers: {'Content-Type' :'application/json'},
      body: JSON.stringify({
        name,
        email,
        password,
        password2
      })
    });
    if (response.ok){
      alert('Please check your email and enter the OTP to complete the registration. !')
      navigate('/organizer/otp/')
    } else {
      alert('this email already exist')
    }
    } catch (error) {
      alert('Error during registration!', error)
    }
  }

  

  return (

    <div>
        <div>
       <div>
        <div className='navbar'>
        <div className="logo-container">
        <a href='/' target="_blank" rel="noopener noreferrer"><img className="logo" src="../../../Image-1 (4).jpg" alt="Qatarfiesta Logo" /></a>
        </div>

        </div>
        <div className='banner'>
        <div className='signin_container'>
            <div className='signin_header'><h1>Register as organizer</h1></div>
            <div>
            <form onSubmit={submit}>
            <input type='text' className='signin_input' placeholder='Organization name' onChange={e => setName(e.target.value)}/>
            <input type='email' className='signin_input' placeholder='Email' onChange={e => setEmail(e.target.value)}/>
            <input type='password' className='signin_input' placeholder='Password(Minimum 6 characters)' onChange={e => setPassword(e.target.value)}/>
            <input type='password' className='signin_input' placeholder='Confirm Password' onChange={e => setPassword2(e.target.value)}/>
            <button className='submit_btn'>Register</button>
            </form>
            </div>
            <div className='signin_footer'>
                <span>Already have an account? <a href='/organizer/Login'>Login</a></span>
            </div>
            
        </div>
        <div className="fade_bottom"></div>
    </div>
    </div>
    </div>
    </div>
  )
}

export default Register

