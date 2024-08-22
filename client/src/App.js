import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Public from './pages/Public';
import Navbar from './pages/Navbar';
import Register from './Adminpages/Register';
import Login from './pages/Login';  
import Profile from './pages/Profile';
import Home from './Screnningpages/Home';
 import New from './Screnningpages/New'
import Screening from './Screnningpages/Screening';
import AdminHome from './Adminpages/AdminHome';
import InterviewHome from './InterviewRound/InterviewHome';
import HrHome from './HrRound/HrHome';
import TrainerHome from './TrainerPages/TrainerHome';
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const showNavbar = location.pathname !== '/'&&location.pathname!=='/login';

  return (
    <div className="App">
      {showNavbar && <Navbar/>}
      <Routes>
        <Route path="/" element={<Public />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/new" element={<New/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path='/screnning' element={<Screening/>}/>
        <Route path='/adminhome' element={<AdminHome/>}/>
        <Route path='/hrhome' element={<HrHome/>}/>
        <Route path='/interviewhome' element={<InterviewHome/>}/>
        <Route path='/trainerhome' element={<TrainerHome/>}/>
      </Routes>
    
    </div>
  );
}

export default App;
