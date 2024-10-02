import React, { useState } from 'react';
import { signup } from '../../api.js'; // Adjust the import path as necessary
import './index.css';

const Register = ({ closeModal, openLoginModal }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = { username, password };

        try {
            const response = await signup(userData);
            // Registration successful, now open the login modal
            closeModal(); // Close the registration modal
            openLoginModal(); // Open the login modal
        } catch (error) {
            setError(error.message || 'Registration failed. Please try again.');
        }
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-btn" onClick={closeModal}>×</button>
                <h2 className="modal-title">Register</h2>

                {error && <p className="error-message">{error}</p>} {/* Display error message */}

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
                                className="modal-input"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span
                                className="password-toggle-icon"
                                onClick={togglePasswordVisibility}
                            >
                                {/* Eye icon inside the field */}
                            </span>
                        </div>
                    </div>
                    <button type="submit" className="modal-submit-btn">Register</button>
                </form>

                <a href="/login" className="modal-link" onClick={openLoginModal}>
                    Already have an account? Sign in
                </a>
            </div>
        </div>
    );
};

export default Register;
