import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
// import { getAuthHeaders } from '../Authorization/getAuthHeaders';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';
import Spinner from 'react-bootstrap/Spinner';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/auth/profile', {
          headers: getAuthHeaders(), 
        });
        setUserData(response.data);
        // localStorage.setItem('role', response.data.user.role);
        // localStorage.setItem('name', response.data.user.name);
        
      } catch (error) {
        setError('Failed to fetch profile data. Please try again later.');
      }
    };

    fetchUserData();
  }, []);

  return (
    <Container style={{ minHeight: '80vh' }} className="d-flex align-items-center justify-content-center">
      <Row className="w-100">
        <Col md={6} className="mx-auto shadow p-4 rounded-5">
          <h2 className="text-center mb-4 font fw-bolder">Profile</h2>
          {error && <Alert variant="danger" className="text-center">{error}</Alert>}
          {userData ? (
            <div className="p-4 rounded bg-white">
              <p><strong>ID:</strong> {userData.id}</p>
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Market:</strong> {userData.market}</p>
              <p><strong>Calendly Username:</strong> {userData.calendlyUsername}</p>
            </div>
          ) : (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" variant="primary" />
              <p className="ms-3">Loading profile data...</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
