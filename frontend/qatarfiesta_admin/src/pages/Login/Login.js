import React, { useState, useEffect} from 'react'
import './Login.css'
import { useNavigate } from 'react-router-dom'

function Login() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)

    

  const submit = async(e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/accounts/api/token/', {
        method: 'POST',
        headers: {'Content-Type' :'application/json'},
        credentials: 'include',
        body: JSON.stringify({
          email,
          password
        })
      });
      if (response.ok){
        console.log('ok')
        const {access, refresh} = await response.json();
        setAccessToken(access);
        console.log('accessToken',access)
        setRefreshToken(refresh);
        console.log('refreshToken',refresh)
  
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
  
        navigate('dashboard/')
      } else {
        alert('Please enter valid credentials!')
      }
      } catch (error) {
        alert('Error during login!', error)
      }
    }


  return (
    <div>
       <div>
        {/* <div className='navbar'>
        <div className="logo-container">
        <a href='http://127.0.0.1:3001/' target="_blank" rel="noopener noreferrer"><img className="logo" src="../../../Image-1 (4).jpg" alt="Qatarfiesta Logo" /></a>
        </div>

        </div> */}
        <div className='banner'>
        <div className='login_container'>
            <div className='login_header'><h1>Admin Login</h1></div>
            <div>
            <form  onSubmit={submit}>
            <input type='email' className='login_input' placeholder='Email' onChange={e => setEmail(e.target.value)}/>
            <input type='password' className='login_input' placeholder='Password' onChange={e => setPassword(e.target.value)}/>
            <button className='submit_btn'>Sign In</button>
            </form>
            </div>
            
        </div>
        <div className="fade_bottom"></div>
    </div>
    </div>
    </div>
  )
}

export default Login
