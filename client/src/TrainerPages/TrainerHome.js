import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';

function TrainerHome() {
  const [profiles, setProfiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [comment, setComment] = useState('');

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

  // Fetch profiles data from the endpoint
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/auth/getpublicprofile', {
          withCredentials: true,
        });
        setProfiles(response.data);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfiles();
  }, []);

  // Open the modal with the selected profile
  const handleOpenModal = (profile) => {
    setSelectedProfile(profile);
    setComment(profile.comments || ''); // Load any existing comment
    setShowModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Handle comment submission
  const handleSubmitComment = async () => {
    try {
      await axios.put(`http://localhost:3001/api/auth/updatecomment/${selectedProfile.id}`, {
        comments: comment,
      });
      setShowModal(false);
      // Optionally update the profiles state with the new comment
      setProfiles((prevProfiles) =>
        prevProfiles.map((profile) =>
          profile.id === selectedProfile.id ? { ...profile, comments: comment } : profile
        )
      );
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };
  // const name=localStorage.getItem('name')
  return (
    <div className="container mt-5">
      <h2 className="text-start mb-4">{`Trainer Dashboard ${name}`}</h2>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Refer By</th>
            <th>Market</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <tr key={profile.id}>
              <td>{profile.id}</td>
              <td>{profile.name}</td>
              <td>{profile.email}</td>
              <td>{profile.phone}</td>
              <td>{profile.referBy}</td>
              <td>{profile.market}</td>
              <td>
                <Button variant="primary" onClick={() => handleOpenModal(profile)}>
                  Add Comment
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Comment Input Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formComment">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your comment here"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitComment}>
            Submit Comment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TrainerHome;
