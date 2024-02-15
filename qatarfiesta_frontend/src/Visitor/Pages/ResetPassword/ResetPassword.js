import React, {useState, useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';


function ResetPassword() {
  const [newPassword, setNewPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const [token, setToken] = useState('')
  const [uidb64, setUidb64] = useState('')
  const location = useLocation();
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_BASE_URL

  useEffect(() => {

      const searchParams = new URLSearchParams(location.search)
      const uidb64 = searchParams.get('uidb64')
      const token = searchParams.get('token')

      setUidb64(uidb64)
      setToken(token)

      console.log('uidb64:', uidb64);
      console.log('token:', token);

  }, [location.search, navigate])

  const requestBody = {
      token: token,
      uidb64: uidb64,
      password: newPassword
  }


  const submit = async(e) => {
      e.preventDefault();

      if (newPassword !== password2) {
        setPasswordsMatch(false)
        alert('Passwords do not match')
        return;
      }

      try {
      const response = await fetch(`${baseURL}/api/v1/accounts/set-password/`, {
      method: 'PATCH',
      headers: {'Content-Type' :'application/json'},
      body: JSON.stringify(requestBody)
      });
      if (response.ok){
          alert('password reset succesfull')
          navigate('/login/')
        } else {
          alert('cannot reset your password')
        }
        } catch (error) {
          alert('Error!', error)
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
    <div className='login_header'><h1>Enter New password</h1></div>
        <form onSubmit={submit}>

        <input type='password' className='login_input' placeholder='Enter your password' value={newPassword} onChange={e => setNewPassword(e.target.value) }/>
        <input type='password' className='signin_input' placeholder='Confirm Password' onChange={e => setPassword2(e.target.value)}/>
        <button className='submit_btn'>Submit</button>
        </form>
    </div>
    <div className="fade_bottom"></div>
</div>
</div>
</div>
)
}

export default ResetPassword
