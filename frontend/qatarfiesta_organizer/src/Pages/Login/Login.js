import React, {useHistory, useState} from 'react'
import './Login.css'
import { useNavigate } from 'react-router-dom'

function Login() {

  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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

      navigate('/')
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
        <div className='navbar'>
        <div className="logo-container">
        <a href='#' target="_blank" rel="noopener noreferrer"><img className="logo" src="../../../Image-1 (4).jpg" alt="Qatarfiesta Logo" /></a>
        </div>

        </div>
        <div className='banner'>
        <div className='login_container'>
            <div className='login_header'><h1>Login to submit events</h1></div>
            <div>
            <form  onSubmit={submit}>
            <input type='email' className='login_input' placeholder='Email' onChange={e => setEmail(e.target.value)}/>
            <input type='password' className='login_input' placeholder='Password' onChange={e => setPassword(e.target.value)}/>
            <button className='submit_btn'>Sign In</button>
            <div className="checkbox-container">
            <a href="/" className="checkbox-link"> Forgot Password?</a>
            </div>
            </form>
            </div>
            <div className='login_footer'>
                <span>New to QatarFiesta? <a href='/Register'>Sign up now</a></span>
            </div>
            
        </div>
        <div className="fade_bottom"></div>
    </div>
    </div>
    </div>
  )
}

export default Login
