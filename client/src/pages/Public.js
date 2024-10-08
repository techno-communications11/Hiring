import React, { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Login from './Login';

function Public() {
  const [error, setError] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [markets, setMarkets] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const referredByRef = useRef();
  const referenceNtidRef = useRef();

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexPhone = /^[0-9]{10}$/;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nameValid = nameRef.current?.value.trim() !== '';
    const emailValid = regexEmail.test(emailRef.current?.value);
    const phoneValid = regexPhone.test(phoneRef.current?.value);
    const marketValid = selectedMarket !== '';
    const referredByValid = referredByRef.current?.value.trim() !== '';
    const referenceNtidValid = referenceNtidRef.current?.value.trim() !== '';

    if (!nameValid || !emailValid || !phoneValid || !marketValid || !referredByValid || !referenceNtidValid) {
      setError('Please fill out all fields correctly.');
      return;
    }

    setError('');

    try {
      const formData = {
        name: nameRef.current.value,
        email: emailRef.current.value,
        phone: phoneRef.current.value,
        market: selectedMarket,
        referBy: referredByRef.current.value,
        referedId: referenceNtidRef.current.value,
      };

      const response = await axios.post('http://localhost:3001/api/auth/publicprofile', formData);

      if (response.status === 201) {
        console.log("Data submitted successfully");
      } else {
        console.log("Unexpected response status:", response.status);
      }
    } catch (error) {
      setError('Failed to submit data. Please try again later.');
    } finally {
      nameRef.current.value = "";
      emailRef.current.value = "";
      phoneRef.current.value = "";
      referredByRef.current.value = "";
      referenceNtidRef.current.value = "";
      setSelectedMarket("");
    }
  };

  const handleSelectMarket = (eventKey) => {
    setSelectedMarket(eventKey);
  };

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/auth/getmarkets');
        setMarkets(response.data);
      } catch (error) {
        setError('Failed to fetch markets. Please try again later.');
      }
    };

    fetchMarkets();
  }, []);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  return (
    <div className='container-fluid d-flex justify-content-center align-items-center vh-100 bg-light'>
      <div className='row w-100 gx-5'>
        <div className='col-12 col-md-6 col-lg-5'>
          <Form className='shadow-lg bg-white p-5 rounded-4' onSubmit={handleSubmit}>
            <h3 className='text-center mb-4 fw-bold text-primary'>Candidate Details Form</h3>

            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Control
                className="shadow-none border"
                ref={nameRef}
                type="text"
                placeholder="Name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                ref={emailRef}
                className="shadow-none border"
                type="email"
                placeholder="Email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPhone">
              <Form.Control
                ref={phoneRef}
                className="shadow-none border"
                type="tel"
                placeholder="Phone Number"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicReferredBy">
              <Form.Control
                ref={referredByRef}
                className="shadow-none border"
                type="text"
                placeholder="Referred By"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicReferenceNtid">
              <Form.Control
                ref={referenceNtidRef}
                className="shadow-none border"
                type="text"
                placeholder="Reference NTID"
              />
            </Form.Group>

            <Form.Group className="mb-3 border-secondary" controlId="formBasicMarket">
              <Dropdown onSelect={handleSelectMarket}>
                <Dropdown.Toggle className='w-100 bg-transparent text-dark border-secondary' id="dropdown-basic">
                  {selectedMarket || "Select Market"}
                </Dropdown.Toggle>
                <Dropdown.Menu className='w-100 overflow-auto' style={{ height: '15rem' }}>
                  {markets.sort((a, b) => a.market.localeCompare(b.market)).map((market) => (
                    <Dropdown.Item key={market.id} eventKey={market.market}>
                      {market.market}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>

            <Button className='w-100' variant="primary" type="submit">
              Submit
            </Button>

            <div className='text-danger mt-3'>{error}</div>
          </Form>
        </div>

        <div className='col-12 col-md-6 col-lg-5 d-flex flex-column justify-content-center align-items-center'>
          <div className="text-center w-100">
            <h3 className='mb-4 text-dark fw-bolder fs-1'>HR Login</h3>
            <Button className='w-75' variant="secondary" onClick={handleLoginClick}>Login</Button>
          </div>
        </div>
      </div>

      <Modal show={showLoginModal} onHide={handleCloseLoginModal} centered>
        <Modal.Body>
          <Login />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Public;
