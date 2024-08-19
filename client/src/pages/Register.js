import React, { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import axios from 'axios';

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [activeForm, setActiveForm] = useState('register'); // 'register' or 'market'
  const [markets, setMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState('');
  const emailRef = useRef();
  const passwordRef = useRef();
  const marketRef = useRef();

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  useEffect(() => {
    // Fetch markets when the component mounts
    const fetchMarkets = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/auth/getmarkets');
        setMarkets(response.data);
      } catch (error) {
        console.error("Error fetching markets:", error);
        setError('Failed to fetch markets. Please try again later.');
      }
    };

    fetchMarkets();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const emailValid = regexEmail.test(email);
    const passwordValid = regexPassword.test(password);

    if (!emailValid && !passwordValid) {
      setError('Please enter a valid email address and a valid password.');
    } else if (!emailValid) {
      setError('Please enter a valid email address.');
    } else if (!passwordValid) {
      setError('Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.');
    } else {
      setError('');
      try {
        // Make API call to register user
        const response = await axios.post('http://localhost:3001/api/auth/register', {
          email,
          password,
          market: selectedMarket
        });
        if (response.status === 201) {
          console.log("User registered successfully");
        }
      } catch (error) {
        setError('Failed to register user. Please try again later.');
      }finally{
        emailRef.current.value=""
        passwordRef.current.value=""
        setSelectedMarket("")
      }
    }
  };

  const handlePasswordShow = () => {
    setShowPassword(!showPassword);
  };
 const [marketData,setMaketData]=useState('')
  const handleMarket = async () => {
    const market = marketRef.current.value;

    if (!market) {
      alert('Market is required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/auth/market', { market }, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.status === 201) {
        alert('Market registered successfully');
       
     
        const marketsResponse = await axios.get('http://localhost:3001/api/auth/getmarkets');
        setMarkets(marketsResponse.data);
      }
    } catch (error) {
      alert('Failed to register market. Please try again later.');
    } finally{
      marketRef.current.value="";
    }
  };

  return (
    <div className='d-flex flex-column align-items-center vh-100 justify-content-center m-auto'>
      <div className='d-flex mb-3'>
        <Button 
          variant={activeForm === 'register' ? 'primary' : 'secondary'} 
          onClick={() => setActiveForm('register')} 
          className='me-2'
        >
          Register User
        </Button>
        <Button 
          variant={activeForm === 'market' ? 'primary' : 'secondary'} 
          onClick={() => setActiveForm('market')}
        >
          Add Market
        </Button>
      </div>
      
      {activeForm === 'register' && (
        <Form className='w-25 shadow-lg p-3 rounded-3' onSubmit={handleSubmit}>
          <h3>Register</h3>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control 
              ref={emailRef} 
              className="shadow-none border" 
              type="email" 
              placeholder="Enter email" 
              required 
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <div className='d-flex border rounded'>
              <Form.Control 
                ref={passwordRef} 
                className="shadow-none border-0" 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                required 
              />
              <span onClick={handlePasswordShow} role='button' className='mt-1 me-1'>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            <span className='text-danger' aria-live="polite">{error}</span>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicMarket">
            <Dropdown onSelect={(e) => setSelectedMarket(e)}>
              <Dropdown.Toggle className='w-100 bg-transparent text-dark border-secondary' id="dropdown-basic">
                {selectedMarket || "Select Market"}
              </Dropdown.Toggle>
              <Dropdown.Menu className='w-100 overflow-auto' style={{height:'15rem'}}>
                {markets.sort((a,b)=>a.market.localeCompare(b.market)).map((market) => (
                  <Dropdown.Item key={market.id} eventKey={market.market}>
                    {market.market}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
          
          <Button variant="primary" type="submit" className='w-100'>
            Register
          </Button>
        </Form>
      )}
      
      {activeForm === 'market' && (
        <Form className='w-25 shadow-lg p-3 rounded-3'>
          <h3>Add Market</h3>
          <Form.Group className="mb-3" controlId="formBasicMarket">
            <Form.Control 
              ref={marketRef} 
              className="shadow-none border" 
              type="text" 
              placeholder="Enter market" 
              required 
            />
          </Form.Group>
          <Button className='w-100' onClick={handleMarket}>Add</Button>
        </Form>
      )}
    </div>
  );
}

export default Register;
