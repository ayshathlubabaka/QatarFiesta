import React, { useState} from 'react'
import './Login.css'
import { jwtDecode } from 'jwt-decode';

function Login() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const baseURL = process.env.REACT_APP_API_BASE_URL

  const submit = async(e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseURL}/api/v1/accounts/api/token/`, {
        method: 'POST',
        headers: {'Content-Type' :'application/json'},
        credentials: 'include',
        body: JSON.stringify({
          email,
          password
        })
      });
      
        if(response.ok) {
          const {access, refresh} = await response.json();

            const decodedToken = jwtDecode(access);
            console.log('decodedToken',decodedToken)
            if (decodedToken && decodedToken.is_superuser) {
              
              localStorage.setItem('access_token', access);
              localStorage.setItem('refresh_token', refresh);
        
              const redirectUrl = localStorage.getItem('redirect_url') || '/admin/';
              localStorage.removeItem('redirect_url');
              window.location.replace(redirectUrl);
        

            }else{
                alert('not admin')
            }
          }else{
            alert('Invalid credentials')
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
        <a href='/' target="_blank" rel="noopener noreferrer"><img className="logo" src="../../../Image-1 (4).jpg" alt="Qatarfiesta Logo" /></a>
        </div>

        </div>
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
