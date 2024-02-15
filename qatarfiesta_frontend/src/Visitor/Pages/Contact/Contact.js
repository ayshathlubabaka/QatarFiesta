import React, { useEffect , useState} from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import { FaComments, FaEnvelopeOpen, FaTimes } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import './Contact.css'
import { AxiosSendMail } from '../../../api';

function Contact() {

    const {event_id} = useParams();
    console.log('contact page',event_id)

    const navigate = useNavigate('')

    const [userId, setUserId] = useState('')
    const [showModal, setShowModal] = useState(false);
    const [recipient, setRecipient] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const { user } = useAuth();

  useEffect(() => {
    console.log('Authenticated user:', user);
    setUserId(user.id)
    console.log('userdata', user);
  }, [user]);

    const handleEmailButtonClick = () => {
      setShowModal(true);
    };

    const handleCloseModal = () => {
      setShowModal(false);
    }


      const handleChat = () => {
        navigate(`/chat/${userId}/${event_id}`)
      }

      const onSend = async (emailData) => {
        try{
          const response = await AxiosSendMail(emailData)
          
      
          if (!(response.status >= 200 && response.status < 300)) {
            throw new Error('Failed to send email');
          }
      
          alert('Email sent successfully!');
        } catch (error) {
          console.error('Error sending email:', error);
          alert('Failed to send email. Please try again later.');
        }
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        if (recipient && subject && message) {
          onSend({ recipient, subject, message });
          setRecipient('');
          setSubject('');
          setMessage('');
        } else {
          alert('Please fill in all fields.');
        }
      };

      if (!userId) {
        return <div>Loading...</div>;
      }

  return (
   <div>
      <Navbar />
      <div className='row'>
        <div className='col-md-2'></div>
        <div className='container col-md-6' style={{ margin: "200px", background: '#e0e0e0' }}>
        <h1>Contact Us</h1>
        <p>Any questions? We are here to help you...</p>
      <div className='row bg bg-light m-2 p-3'>
           <div className='col-2'><FaEnvelopeOpen size="2x" /></div>
           <div className='col-6'><h4 style={{fontWeight:"bolder"}}>EMAIL</h4><p>Typical reply time: Within a day or two</p></div>
           <div className='col-4'><button style={{background:"orange", width:"8rem", marginTop:"2rem"}} onClick={handleEmailButtonClick}>Email Us</button></div>
          </div>

          <div className='row bg bg-light m-2 p-3'>
           <div className='col-2'><FaComments  size="2x" /></div>
           <div className='col-6'><h4 style={{fontWeight:"bolder"}}>CHAT</h4><p>Time: 6am to 6 pm</p></div>
           <div className='col-4'><button onClick={handleChat} style={{background:"orange", width:"8rem", marginTop:"1rem"}}>Chat with Us</button></div>
          </div>
      </div>
      </div>
      {showModal && (
  <div className="modal-wrapper">
    <div className="modal1">
      <div className="modal-header">
        <h2>Email Us </h2>
        <button className='btn btn-danger'  onClick={handleCloseModal}><FaTimes /></button>
      </div>
      <form onSubmit={handleSubmit} className="compose-mail-form">
        <div className="form-group">
          <input
            type="email"
            placeholder="To"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <button type="submit">Send</button>
        
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  )
}

export default Contact
