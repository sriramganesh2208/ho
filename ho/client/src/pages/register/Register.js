import React, { useState } from 'react';
import axios from 'axios';
import { GoogleLogin } from 'react-google-login';

const Register = () => {
  const [formData, setFormData] = useState({
    Username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/register', formData);
      console.log(response.data); // Log response for debugging
      // Optionally, you can redirect to a success page or display a success message
    } catch (err) {
      setError(err.response.data.error || 'Failed to register. Please try again later.');
    }
  };

  const handleGoogleSuccess = async (googleData) => {
    try {
      const { tokenId } = googleData;
      const response = await axios.post('/api/auth/google/callback', { tokenId });
      console.log(response.data); // Log response for debugging
      // Optionally, you can redirect to a success page or display a success message
    } catch (err) {
      setError(err.response.data.error || 'Failed to register with Google. Please try again later.');
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Google authentication failed:', error);
    setError('Google authentication failed. Please try again later.');
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="Username">Username:</label>
          <input
            type="text"
            id="Username"
            name="Username"
            value={formData.Username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit">Register</button>
      </form>

      {/* Google Sign-In Button */}
      <GoogleLogin
        clientId="450627382054-pkcrn0akt03q680ec0vamlb6752ua691.apps.googleusercontent.com"
        buttonText="Register with Google"
        onSuccess={handleGoogleSuccess}
        onFailure={handleGoogleFailure}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  );
};

export default Register;
