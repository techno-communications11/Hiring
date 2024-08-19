import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import axios from 'axios';

function AppNavbar() {
  const navigate = useNavigate(); 
  const [error, setError] = useState('');
  const [counts, setCounts] = useState({}); // Adjusted from '' to an empty object

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3001/api/auth/logout', {}, {
        withCredentials: true 
      });

      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/auth/newCounts', {
          withCredentials: true,
        });
        setCounts(response.data);
      } catch (error) {
        setError('Failed to fetch counts. Please try again later.');
      }
    };

    fetchCounts();
  }, []);

  return (
    <Navbar style={{ backgroundColor:'#E1017'}} expand="lg" className='shadow-sm'>
      <Container fluid>
        <Navbar.Brand  className=' fw-bolder'>
          <img src="/logo.png" alt="Logo" width="30" height="30" className=" text-decoration-none d-inline-block align-top" />
          {' '}TECHNO COMMUNICATION LLC
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        <Navbar.Collapse id="navbarSupportedContent">
          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              to="/new"
              className='fw-bolder'
              style={{
                position: 'relative',
                display: 'inline-block',
                background: 'linear-gradient(90deg, rgba(63,94,251,1) 0%, rgba(180,27,148,1) 81%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent', // Hide default text color
                fontWeight: 'bold', // Make text bold
              }}
            >
              New{counts.totalProfiles>0&&
              <sup className='text-white bg-danger px-1 rounded-circle' style={{fontSize:'10px' }}>
                {counts.totalProfiles}
              </sup>}
            </Nav.Link>
            <Nav.Link as={Link} to="/profile">
              <FaUser className='me-4' />
            </Nav.Link>
            <Nav.Link as={Link} to="/host">
             Add Host
            </Nav.Link>
            <Button variant="danger" className='me-4' onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
