import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Modal, Button, Form, Table } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import { getAuthHeaders } from '../Authrosization/getAuthHeaders';

function Home() {
  const [counts, setCounts] = useState({
    totalProfiles: 0,
    movedProfiles: 0,
    noResponseProfiles: 0,
    notInterestedProfiles: 0,
    rejectedProfiles: 0,
  });
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/auth/profilecounts', {
          headers: getAuthHeaders(),
        });
        setCounts(response.data);
      } catch (error) {
        setError('Failed to fetch profile counts. Please try again later.');
      }
    };

    fetchCounts();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = profiles.filter(profile =>
        profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.profileStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.phone.toString().includes(searchQuery) ||
        profile.market.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.referBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (profile.date && profile.date.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredProfiles(filtered);
    } else {
      setFilteredProfiles(profiles);
    }
  }, [searchQuery, profiles]);

  const fetchProfilesByStatus = async (status) => {
    try {
      const response = await axios.get('http://localhost:3001/api/auth/getprofiles', {
        params: { status },
        headers: getAuthHeaders(),
      });
      setProfiles(response.data);
      setFilteredProfiles(response.data);
      setSelectedStatus(status);
      setShowModal(true);
    } catch (error) {
      setError('Failed to fetch profiles. Please try again later.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProfiles([]);
    setFilteredProfiles([]);
    setSearchQuery('');
  };

  const formatTime = (date) => {
    return date ? format(parseISO(date), 'EEE dd MMM yyyy HH:mm') : 'N/A';
  };
  const name=localStorage.getItem('name')
  return (
    <Container style={{ minHeight: "80vh" }} className='font'>
      <h2 className="my-4 text-start fw-bolder" >{`Screening Dahshboard ${name}`}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <Row>
        <Col md={4} className="mb-4">
          <Card onClick={() => fetchProfilesByStatus('Total')} style={{ cursor: 'pointer' }} className='border p-4 shadow-sm'>
            <Card.Body>
              <Card.Title className='fw-bolder'>Total</Card.Title>
              <Card.Text className="display-4 fw-bolder">{counts.totalProfiles}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4 ">
          <Card onClick={() => fetchProfilesByStatus('Moved')} style={{ cursor: 'pointer' }} className='border p-4 shadow-sm'>
            <Card.Body>
              <Card.Title className='fw-bolder'>Moved</Card.Title>
              <Card.Text className="display-4 fw-bolder">{counts.movedProfiles}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card onClick={() => fetchProfilesByStatus('No Response')} style={{ cursor: 'pointer' }} className='border p-4 shadow-sm'>
            <Card.Body>
              <Card.Title className='fw-bolder'>No-Response</Card.Title>
              <Card.Text className="display-4 fw-bolder">{counts.noResponseProfiles}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card onClick={() => fetchProfilesByStatus('Not Interested')} style={{ cursor: 'pointer' }} className='border p-4 shadow-sm'>
            <Card.Body>
              <Card.Title className='fw-bolder'>Not-Interested</Card.Title>
              <Card.Text className="display-4 fw-bolder">{counts.notInterestedProfiles}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card onClick={() => fetchProfilesByStatus('Reject')} style={{ cursor: 'pointer' }} className='border p-4 shadow-sm'>
            <Card.Body>
              <Card.Title className='fw-bolder'>Rejected</Card.Title>
              <Card.Text className="display-4 fw-bolder">{counts.rejectedProfiles}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} size='xl' className="custom-modal-width"  style={{marginTop:'7vh'}}  >
        <Modal.Header closeButton>
          <Modal.Title>{selectedStatus} Profiles</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <Form className="mb-3 m-auto w-50 ">
            <Form.Control
              type="text"
              className='fw-bolder  border-dark'
              placeholder="Search profiles by name, status, market, date, referred by..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form>
          {filteredProfiles.length > 0 ? (
            <Table striped bordered hover responsive className='border-dark fw-bolder'>
              <thead>
                <tr> <th style={{backgroundColor:'#E10174', color:'white'}}>SC.No</th>
                  <th style={{backgroundColor:'#E10174', color:'white'}}>Name</th>
                  <th style={{backgroundColor:'#E10174', color:'white'}}>Email</th>
                  <th style={{backgroundColor:'#E10174', color:'white'}}>Phone</th>
                  <th style={{backgroundColor:'#E10174', color:'white'}}>Referred By</th>
                  <th style={{backgroundColor:'#E10174', color:'white'}}>Reference NTID</th>
                  <th style={{backgroundColor:'#E10174', color:'white'}}>Market</th>
                  <th style={{backgroundColor:'#E10174', color:'white'}}>Status</th>
                  <th style={{backgroundColor:'#E10174', color:'white'}}>Date</th>
                  <th  style={{backgroundColor:'#E10174', color:'white'}}>Comments</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfiles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((profile,index) => (
                  <tr key={profile.id}>
                    <td>{index+1}</td>
                    <td>{profile.name}</td>
                    <td>{profile.email}</td>
                    <td>{profile.phone}</td>
                    <td>{profile.referBy}</td>
                    <td>{profile.referedId}</td>
                    <td>{profile.market}</td>
                    <td>{profile.profileStatus}</td>
                    <td>{formatTime(profile.createdAt)}</td>
                    <td>{profile.comments}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No profiles available for this status.</p>
          )}
        </Modal.Body>
        <Modal.Footer className='py-4'>
          <Button variant="secondary" className='bg-transparent text-dark' onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Home;
