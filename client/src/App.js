import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import AdminHome from './Adminpages/AdminHome';
import HrHome from './HrRound/HrHome';
import TrainerHome from './TrainerPages/TrainerHome';
import Home from './Screnningpages/Home';
import InterviewHome from './InterviewRound/InterviewHome';
import Login from './pages/Login';
import Public from './pages/Public';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './pages/Navbar';
import Register from './Adminpages/Register';
import New from './Screnningpages/New';
import Listprofile from './Screnningpages/Screening';
import Profile from './pages/Profile';
import {jwtDecode} from 'jwt-decode'; // Corrected import

function App() {
  return (
    <Router>
      <AppComponent />
    </Router>
  );
}

function AppComponent() {
  const token = localStorage.getItem('token');
  let role = null;

  // Decode the token if it exists
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      role = decodedToken.role;
    } catch (error) {
      console.error('Token decoding failed', error);
    }
  }

  const location = useLocation();
  const showNavbar = location.pathname !== '/' && location.pathname !== '/login';

  return (
    <div className="App">
      {showNavbar && <Navbar />}
      <Routes>
        {!token ? (
          <>
            <Route path="/" element={<Public />} />
            <Route path="/login" element={<Login />} />
          </>
        ) : (
          <>
            {role === 'Admin' && (
              <>
                <Route path="/adminhome" element={<AdminHome />} />
                <Route path="/register" element={<Register />} />
              </>
            )}
            {role === 'HR' && <Route path="/hrhome" element={<HrHome />} />}
            {role === 'Trainer' && <Route path="/trainerhome" element={<TrainerHome />} />}
            {role === 'Screening Manager' && (
              <>
                <Route path="/home" element={<Home />} />
                <Route path="/new" element={<New />} />
                <Route path="/screening" element={<Listprofile />} />
              </>
            )}
            {role === 'Interviewer' && <Route path="/interviewhome" element={<InterviewHome />} />}
            <Route path="/profile" element={<Profile />} />
          </>
        )}
        <Route path="*" element={<Navigate to={token ? '/profile' : '/'} />} />
      </Routes>
    </div>
  );
}

export default App;
