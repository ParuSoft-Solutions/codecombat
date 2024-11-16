import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Auth from "../../assets/Auth.png";
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios'; // Import axios for HTTP requests

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  // const [agreeTerms, setAgreeTerms] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  // Initialize useNavigate hook
  const navigate = useNavigate();

  // Validation function
  const validate = () => {
    let tempErrors = {};

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email) {
      tempErrors.email = "Email is required";
    } else if (!emailPattern.test(userData.email)) {
      tempErrors.email = "Email is not valid";
    }

    // Password validation
    if (!userData.password) {
      tempErrors.password = "Password is required";
    } else if (userData.password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters";
    }

    // if (!agreeTerms) {
    //   tempErrors.terms = " You must agree to the terms and conditions";
    

    // }


    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0; // No errors, form is valid
  };

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // const handleCheckbox = () => {
  //   setAgreeTerms(!agreeTerms);
  // };

  // Submit form to backend API
  const submitForm = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        // Send login request to backend
        const response = await axios.post('http://localhost:5000/auth/login', userData);

        // If login is successful, navigate to profile
        if (response.status === 200) {
          // Save the JWT token or user data in localStorage or cookies for session management
          localStorage.setItem('token', response.data.token);  // Assuming you return a token on success

          navigate('/profile'); // Redirect to profile page after successful login
        }
      } catch (error) {
          // Invalid Creadentials
          setErrors({ login: 'Something went wrong, please try again' });
          setShowDialog(true)
      }
    }
  };

  const closeDialog = () => setShowDialog(false);

  // Google Sign-In Success Handler
  const handleGoogleLogin = async (response) => {
    if (response.error) {
      console.error('Google Login Error: ', response.error);
      return;
    }
  
    const idToken = response.credential; // Google ID token
    try {
      const res = await axios.post('http://localhost:5000/auth/google', { idToken });
      console.log('Login success:', res.data);
      navigate('/profile');
    } catch (error) {
      console.error('Error during Google login:', error);
      alert('Login failed, please try again');
    }
  };
  
  
  return (
    <section className='flex gap-20 h-screen w-screen items-center justify-center overflow-hidden'>
      <div className='bg-gray-100 h-[80vh] w-1/3'>
        <img src={Auth} alt='Login' className='h-[full] w-full object-cover' />
      </div>
      <div className='h-[650px] w-[900px] bg-[#8543f628] flex items-center justify-center flex-col gap-2 p-2 rounded-md'>
        <p className='text-3xl font-semibold'>Login</p>
        <form className='flex flex-col gap-8 w-full p-10' onSubmit={submitForm}>
          <div className='flex flex-col gap-2'>
            <input
              type='email'
              id='email'
              value={userData.email}
              placeholder='Email'
              className='h-16 w-full rounded-md p-5'
              onChange={handleChange}
            />
            <input
              type='password'
              id='password'
              value={userData.password}
              placeholder='Password'
              className='h-16 w-full rounded-md p-5'
              onChange={handleChange}
            />
          </div>

          {/* <span className='flex gap-2 items-center'>
            <input
              type='checkbox'
              className='border-gray-400'
              checked={agreeTerms}
              onChange={handleCheckbox}
            />
            <p className='text-gray-400'>Agree to terms and conditions</p>
          </span> */}

          <div className='flex flex-col gap-2'>
            <button
              onClick={handleGoogleLogin}
              type="submit"
              className='h-16 w-full flex items-center justify-center text-white bg-[#8543f6] font-semibold text-lg rounded-md'
            >
              Login
            </button>
            <div className='w-full flex justify-between px-5 text-gray-400'>
              <p><Link to="/signup">Register</Link></p>
              <p>Forgot Password</p>
            </div>
          </div>
        </form>

        <p className='items-center'>or</p>
        <div className='flex items-center justify-center w-[80%]'>
          {/* Google Login Button */}
          <GoogleLogin
            onSuccess={handleGoogleLogin}  // Handle success response
            onError={(error) => console.error('Google Login Error:', error)}  // Handle error
            useOneTap={true} // Optional, to trigger sign-in automatically in some cases
            theme="outline"
            shape="pill"
            width="100%"  // Make button width fit
          />
        </div>
      </div>

      {/* Dialog Box for Validation Errors */}
      {showDialog && (
        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-5 rounded-md shadow-lg max-w-sm w-full'>
            <h2 className='text-xl font-semibold mb-4'>Validation Errors</h2>
            <ul className='text-red-600 list-disc list-inside'>
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
            <button
              onClick={closeDialog}
              className='mt-4 w-full bg-[#8543f6] text-white py-2 rounded-md'
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Login;
