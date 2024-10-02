import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { login as apiLogin } from '../../api.js'; // Adjust the import path as necessary
import './index.css'; // Ensure to add the CSS mentioned below

const Login = ({ closeModal }) => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiLogin({ username, password });
      const userData = {
        username: response.user.username, 
        token: response.token,
      };
      login(userData);
      localStorage.setItem('token', response.token);
      closeModal();
    } catch (error) {
      setErrorMessage(error.message || 'Login failed. Please check your credentials and try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={closeModal}>×</button>
        <h2 className="modal-title">Login</h2>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <form onSubmit={handleSubmit}>
          <div className="username">
            <label>Username</label>
            <input
              type="text"
              className="modal-input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="password">
            <label>Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                className="modal-input password-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="password-toggle-icon"
                onClick={togglePasswordVisibility}
              >
              </span>
            </div>
          </div>
          
          <button type="submit" className="modal-submit-btn">Login</button>
        </form>

        <a href="/register" className="modal-link">Don't have an account? Register</a>
      </div>
    </div>
  );
};

export default Login;
