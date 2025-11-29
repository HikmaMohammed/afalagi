import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

// Material Icons
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-grid">
          {/* Left Side - Branding */}
          <motion.div 
            className="auth-branding"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="branding-content">
              <div className="brand-logo">
                <PersonSearchIcon />
              </div>
              <h1>Welcome to Afalagi</h1>
              <p>
                Join our community and help reunite families with their loved ones.
                Every sighting matters, every share helps.
              </p>
              <div className="branding-features">
                <div className="feature">
                  <span className="feature-icon">🔍</span>
                  <span>Report missing persons</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">👁️</span>
                  <span>Report sightings</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🤝</span>
                  <span>Help reunite families</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div 
            className="auth-form-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="auth-card">
              <div className="auth-header">
                <h2>Sign In</h2>
                <p>Enter your credentials to access your account</p>
              </div>

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label className="form-label">
                    <EmailIcon />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <LockIcon />
                    Password
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={password}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="forgot-link">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="spinner spinner-sm"></div>
                  ) : (
                    <>
                      <LoginIcon />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              <div className="auth-footer">
                <p>
                  Don't have an account?{' '}
                  <Link to="/register" className="auth-link">
                    Create one now
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
