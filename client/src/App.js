import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Public from './pages/Public';
import Navbar from './pages/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';  
import Profile from './pages/Profile';
import Footer from './pages/Footer';
import Home from './pages/Home';
 import New from './pages/New'
import Hosts from './pages/Hosts';
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
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Public />} />
        <Route path="/login"  element={!showNavbar&&<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/new" element={<New/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path='/host'element={<Hosts/>}/>
      </Routes>
      {showNavbar && <Footer/>}
    </div>
  );
}

export default App;
