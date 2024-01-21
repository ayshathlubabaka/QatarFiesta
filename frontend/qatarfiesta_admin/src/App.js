import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard';
import UserManage from './pages/UserManage/UserManage';
import OrganizerManage from './pages/OrganizerMange/OrganizerManage';
import CategoryManage from './pages/CategoryManage/CategoryManage';

function App() {
  return (
    <Router>
<div className="App">
  <Routes>
    <Route path='/' element={<Login />} />
    <Route path='dashboard/' element={<Dashboard />} />
    <Route path='user/' element={<UserManage />} />
    <Route path='organizer/' element={<OrganizerManage />} />
    <Route path='category/' element={<CategoryManage />} />
  </Routes>
  
  </div>
    </Router>
    
  );
}

export default App;
