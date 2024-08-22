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
  const [role,setRole]=useState('');
  const [authenticated,setAuthenticated]=useState(false)

  // Regular expressions for validation
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    // Validate email and password
    const emailValid = regexEmail.test(email);
    const passwordValid = regexPassword.test(password);

    if (!emailValid && !passwordValid) {
      setError('Please enter a valid email address and a valid password.');
      return;
    } else if (!emailValid) {
      setError('Please enter a valid email address.');
      return;
    } else if (!passwordValid) {
      setError('Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }

    setError('');

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', { email, password }, { withCredentials: true });
      if (response.status === 200) {
        setRole(response.data.user.role)
        setAuthenticated(!authenticated)
        
        localStorage.setItem('token', response.data.token); 
        localStorage.setItem('role', response.data.user.role);
        
        
      }
    } catch (error) {
      setError('Login failed. Please check your email and password.');
    }
  };
  if(authenticated &&role=='Admin'){
 navigate('/adminhome')
  }
  if(authenticated&& role=='HR'){
    navigate('/hrhome')
  }
  if(authenticated&& role=='Trainer'){
    navigate('/trainerhome')
  }
  if(authenticated&& role=='Screening Manager'){
    navigate('/home')
  }
  if(authenticated&& role=='Interviewer'){
    navigate('/interviewhome')
  }

  const handlePasswordShow = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className='d-flex justify-content-center align-items-center vh-100'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-md-6 col-lg-4'>
            <Form className='shadow-lg p-4 rounded' onSubmit={handleSubmit}>
              <h3 className='text-center mb-4'>Login</h3>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control
                  ref={emailRef}
                  type="email"
                  placeholder="Enter email"
                  required
                  className="shadow-none border"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <div className='d-flex border rounded'>
                  <Form.Control
                    ref={passwordRef}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    className="shadow-none border-0"
                  />
                  <span onClick={handlePasswordShow} role='button' className='mt-2 me-2'>
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
                {error && <span className='text-danger d-block mt-2 text-center'>{error}</span>}
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
