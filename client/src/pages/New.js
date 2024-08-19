import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Button, Modal, Dropdown, Form } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parseISO } from 'date-fns';

function New() {
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showCalendlyModal, setShowCalendlyModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [comment, setComment] = useState('');
  const [moveForwardMenu, setMoveForwardMenu] = useState(false);
  const [selectedHost, setSelectedHost] = useState(null);
  const [hosts, setHosts] = useState([]);
  const [calendlyUrl, setCalendlyUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/auth/getpublicprofile', {
          withCredentials: true,
        });
        setProfiles(response.data);
      } catch (error) {
        setError('Failed to fetch profiles. Please try again later.');
      }
    };

    fetchProfiles();
  }, []);

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/auth/host-get', {
          withCredentials: true,
        });
        setHosts(response.data);
      } catch (error) {
        setError('Failed to fetch hosts. Please try again later.');
      }
    };

    fetchHosts();
  }, []);

  const handleShowModal = (profile) => {
    setSelectedProfile(profile);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProfile(null);
    setComment('');
    setSelectedHost(null);
    setCalendlyUrl('');
    setShowCalendlyModal(false);
  };

  const handleActionClick = async (profileId, action) => {
    const status = {
      profileId: profileId,
      action: action,
      comment: comment,
    };

    try {
      const response = await axios.put('http://localhost:3001/api/auth/updatestatus', status, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setProfiles(prevProfiles => prevProfiles.filter(profile => profile.id !== profileId));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      handleCloseModal();
    }
  };

  const handleMoveForwardMenuToggle = () => {
    setMoveForwardMenu(!moveForwardMenu);
  };

  const handleSelectHost = async (eventKey) => {
    const selected = hosts.find(host => host.name === eventKey);
    setSelectedHost(selected);

    if (selected) {
      const calendlyUrl = `https://calendly.com/${selected.calendlyUsername}`;
      setCalendlyUrl(calendlyUrl);
      setShowCalendlyModal(true);
    }
  };

  const formatTime = (date) => {
    return format(parseISO(date), 'EEE dd MMM yyyy HH:mm');
  };

  const filteredProfiles = profiles.filter(profile => {
    const lowercasedTerm = searchTerm.toLowerCase();
    return profile.name.toLowerCase().includes(lowercasedTerm) ||
      profile.email.toLowerCase().includes(lowercasedTerm) ||
      profile.phone.toString().includes(lowercasedTerm) ||
      profile.market.toLowerCase().includes(lowercasedTerm) ||
      profile.createdAt.toLowerCase().includes(lowercasedTerm);
  });

  const sortedProfiles = [...filteredProfiles].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div  style={{minHeight:'50rem'}}  >
      <h2 className="my-4 font fw-bolder">Public Profiles</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <Form className="mb-4">
        <Form.Control
        className=' m-auto border-black fw-bolder w-50 my-5'
          type="text"
          placeholder="Search by Name, Email, Phone, Market, or Date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form>
      <Table striped bordered hover responsive className=' border-black fw-bolder' >
        <thead>
          <tr  >
            <th style={{backgroundColor:'#E10174', color:'white'}}>SC.NO</th>
            <th style={{backgroundColor:'#E10174', color:'white'}}>Name</th>
            <th style={{backgroundColor:'#E10174', color:'white'}}>Email</th>
            <th style={{backgroundColor:'#E10174', color:'white'}}>Phone</th>
            <th style={{backgroundColor:'#E10174', color:'white'}}>Referred By</th>
            <th style={{backgroundColor:'#E10174', color:'white'}}>Reference NTID</th>
            <th style={{backgroundColor:'#E10174', color:'white'}}>Market</th>
            <th style={{backgroundColor:'#E10174', color:'white'}}>Created At</th>
            <th style={{backgroundColor:'#E10174', color:'white'}}>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedProfiles.length > 0 ? (
            sortedProfiles.map((profile, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{profile.name}</td>
                <td>{profile.email}</td>
                <td>{profile.phone}</td>
                <td>{profile.referBy}</td>
                <td>{profile.referedId}</td>
                <td>{profile.market}</td>
                <td>{formatTime(profile.createdAt)}</td>
                <td>
                  <Button className='btn btn-primary shadow-none fw-bold'  onClick={() => handleShowModal(profile)}>Continue</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No profiles available.</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" >
  <Modal.Header closeButton>
    <Modal.Title>Action for {selectedProfile?.name}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="comment" className='mx-5'>
        <Form.Label className='fw-bolder'>Comment<sup className='fs-6 text-danger'>*</sup></Form.Label>
        <Form.Control
        className='border-dark'
          as="textarea"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Form.Group>
      <div className="d-flex  mx-3 flex-column flex-md-row justify-content-around mt-3">
        <Button variant="danger" className="mb-2 mb-md-0 bg-transparent text-dark" onClick={() => handleActionClick(selectedProfile.id, 'Reject')}>Reject</Button>
        <Button variant="warning" className="mb-2 mb-md-0 bg-transparent text-dark" onClick={() => handleActionClick(selectedProfile.id, 'No Response')}>No Response</Button>
        <Dropdown onSelect={handleSelectHost} show={moveForwardMenu} onToggle={handleMoveForwardMenuToggle}>
          <Dropdown.Toggle className='w-100 bg-transparent text-dark border-secondary' id="dropdown-basic">
            Move Forward
          </Dropdown.Toggle>
          <Dropdown.Menu className='w-100 overflow-auto' style={{ maxHeight: '200px' }}>
            {hosts.sort((a, b) => a.name.localeCompare(b.name)).map((host, index) => (
              <Dropdown.Item key={index} eventKey={host.name}>
                {host.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Button variant="warning" className="mb-2 mb-md-0 bg-transparent text-dark" onClick={() => handleActionClick(selectedProfile.id, 'Not Interested')}>Not Interested</Button>
      </div>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <div className='mx-2 mx-md-5 p-1 p-md-2 text-danger' style={{ border: '1px dashed' }}>
      <h4 className='text-center'>Note:</h4>
      <span>
        * Only Click 'Delete' button after you scheduled the meeting
        <br />
        * This button makes data disappear to simplify the view of the page so that only unscheduled will be visible to you
      </span>
    </div>
    <Button variant="danger" className="mb-2 mb-md-0 bg-transparent text-dark" onClick={() => handleActionClick(selectedProfile.id, 'Moved')}>Delete</Button>
  </Modal.Footer>
</Modal>

<Modal show={showCalendlyModal} onHide={() => setShowCalendlyModal(false)} size="lg" >
  <Modal.Header closeButton>
    <Modal.Title>Schedule Meeting</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="text-center">
      <iframe
        src={calendlyUrl}
        width="100%"
        height="600"
        frameBorder="0"
        title="Calendly Scheduling"
        style={{ maxWidth: '100%' }} // Ensures iframe doesn't overflow
      />
    </div>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" className="mb-2 mb-md-0 bg-transparent text-dark" onClick={() => setShowCalendlyModal(false)}>Close</Button>
  </Modal.Footer>
</Modal>

    </div>
  );
}

export default New;
