import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import VisitorRoutes from './Visitor/VisitorRoutes';
import OrganizerRoutes from './Organizer/OrganizerRoutes';
import AdminRoutes from './Admin/AdminRoutes';


function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
       <Route path="/*" element={<VisitorRoutes />} />
       <Route path="organizer/*" element={<OrganizerRoutes />} />
       <Route path="admin/*" element={<AdminRoutes />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
