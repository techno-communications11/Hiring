import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';

function Hosts() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [calendlyUsername, setCalendlyUsername] = useState('');

  // Function to handle adding host
  const handleAddHost = async () => {
    const hostData = { name, email, calendlyUsername };
  
    try {
      const response = await axios.post('http://localhost:3001/api/auth/host-post', hostData, {
        withCredentials: true // Include cookies in the request
      });
      if (response.status === 200) {
        
      }
    } catch (error) {
    } finally {
      // Clear form fields
      setName('');
      setEmail('');
      setCalendlyUsername('');
    }
  };
  

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    handleAddHost();
  };

  return (
    <div style={{minHeight:"80vh"}}>
    <Form onSubmit={handleSubmit} className='w-25 border p-4 rounded mb-5 m-auto mt-5' >
      <h4>Add Hosts</h4>
      <Form.Group controlId="formName" className='my-3'>
        <Form.Control
          type="text"
          placeholder="Enter host name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="formEmail" className='my-3'>
        <Form.Control
          type="email"
          placeholder="Enter host email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="formCalendlyUsername" className='my-3'>
        <Form.Control
          type="text"
          placeholder="Enter Calendly username"
          value={calendlyUsername}
          onChange={(e) => setCalendlyUsername(e.target.value)}
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit" className='w-100'>
        Add Host
      </Button>
    </Form>
    </div>
  );
}

export default Hosts;
