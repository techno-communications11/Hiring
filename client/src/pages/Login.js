import React, { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const emailValid = regexEmail.test(email);
    const passwordValid = regexPassword.test(password);
    const formData = {
      email,
      password,
    }

    if (!emailValid && !passwordValid) {
      setError('Please enter a valid email address and a valid password.');
    } else if (!emailValid) {
      setError('Please enter a valid email address.');
    } else if (!passwordValid) {
      setError('Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.');
    } else {
      setError('');
      try {
        const response = await axios.post('http://localhost:3001/api/auth/login', formData, { withCredentials: true });
        if (response.status === 200) {
          navigate('/home');
        }
      } catch (error) {
        setError('Login failed. Please try again.');
      }
    }
  };

  const handlePasswordShow = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='d-flex justify-content-center align-items-center vh-100'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-md-6 col-lg-4'>
            <Form className='shadow-lg p-3 rounded-3' onSubmit={handleSubmit}>
              <h3 className='text-center mb-4'>Login</h3>
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
                <span className='text-danger d-block mt-2 text-center'>{error}</span>
              </Form.Group>

              <Button variant="primary" type="submit" className='w-100'>
                Login
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
