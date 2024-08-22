import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Modal, Button, Table } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';

function AdminHome() {
  const [profileStats, setProfileStats] = useState({
    total: 120,
    rejected: 30,
    notInterested: 40,
    selected: 50,
    noResponse: 25,
    rejectedInterview: 15,
    rejectedHR: 20,
  });

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [profiles, setProfiles] = useState([]);

  // const name = localStorage.getItem('name');
  const token = localStorage.getItem('token');
  let name = null;

  // Decode the token if it exists
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      name = decodedToken.name;
    } catch (error) {
      console.error('Token decoding failed', error);
    }
  }

  const handleCardClick = async (type) => {
    setModalTitle(type);

    try {
      const response = await axios.get(`http://localhost:3001/api/auth/getprofilesbytype/${type}`, {
        withCredentials: true,
      });
      setProfiles(response.data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-start mb-4">{`Admin Dashboard ${name}`}</h2>
      
      {/* First row with 3 cards */}
      <Row className="text-center">
        <Col>
          <Card className="mb-4 shadow-sm" style={{height:'8rem',cursor:'pointer'}} onClick={() => handleCardClick('total')}>
            <Card.Body>
              <Card.Title>Total</Card.Title>
              <Card.Text>{profileStats.total}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="mb-4 shadow-sm" style={{height:'8rem',cursor:'pointer'}} onClick={() => handleCardClick('rejected')}>
            <Card.Body>
              <Card.Title>Rejected</Card.Title>
              <Card.Text>{profileStats.rejected}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="mb-4 shadow-sm" style={{height:'8rem',cursor:'pointer'}} onClick={() => handleCardClick('notInterested')}>
            <Card.Body>
              <Card.Title>Not Interested</Card.Title>
              <Card.Text>{profileStats.notInterested}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Second row with 3 cards */}
      <Row className="text-center">
        <Col>
          <Card className="mb-4 shadow-sm" style={{height:'8rem',cursor:'pointer'}} onClick={() => handleCardClick('selected')}>
            <Card.Body>
              <Card.Title>Selected </Card.Title>
              <Card.Text>{profileStats.selected}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="mb-4 shadow-sm" style={{height:'8rem',cursor:'pointer'}} onClick={() => handleCardClick('noResponse')}>
            <Card.Body>
              <Card.Title>No Response</Card.Title>
              <Card.Text>{profileStats.noResponse}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="mb-4 shadow-sm" style={{height:'8rem',cursor:'pointer'}} onClick={() => handleCardClick('rejectedInterview')}>
            <Card.Body>
              <Card.Title>Rejected Interviewer</Card.Title>
              <Card.Text>{profileStats.rejectedInterview}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Third row with 1 card */}
      <Row className="text-center">
        <Col>
          <Card className="mb-4 shadow-sm" style={{width:'22rem', height:'8rem',cursor:'pointer'}} onClick={() => handleCardClick('rejectedHR')}>
            <Card.Body>
              <Card.Title>Rejected HR</Card.Title>
              <Card.Text>{profileStats.rejectedHR}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal to display profiles */}
      <Modal show={showModal} onHide={handleCloseModal} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle} Profiles</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Market</th>
                <th>referBy</th>
                <th>referedNtid</th>
                <th>comments</th>
                <th>status</th>
                 <th>cretedAt</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <tr key={profile.id}>
                  <td>{profile.id}</td>
                  <td>{profile.name}</td>
                  <td>{profile.email}</td>
                  <td>{profile.phone}</td>
                  <td>{profile.market}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminHome;
