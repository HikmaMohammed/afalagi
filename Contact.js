import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

// Material Icons
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import SubjectIcon from '@mui/icons-material/Subject';
import MessageIcon from '@mui/icons-material/Message';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';

import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  const contactInfo = [
    {
      icon: <LocationOnIcon />,
      title: 'Our Location',
      details: ['St. Mary\'s University', 'Addis Ababa, Ethiopia'],
      color: 'primary'
    },
    {
      icon: <PhoneIcon />,
      title: 'Phone Number',
      details: ['+251 911 234 567', '+251 912 345 678'],
      color: 'success'
    },
    {
      icon: <EmailIcon />,
      title: 'Email Address',
      details: ['info@afalagi.et', 'support@afalagi.et'],
      color: 'info'
    },
    {
      icon: <AccessTimeIcon />,
      title: 'Working Hours',
      details: ['Mon - Fri: 8:00 AM - 6:00 PM', 'Sat: 9:00 AM - 2:00 PM'],
      color: 'warning'
    }
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, href: '#', label: 'Facebook' },
    { icon: <TwitterIcon />, href: '#', label: 'Twitter' },
    { icon: <InstagramIcon />, href: '#', label: 'Instagram' },
    { icon: <TelegramIcon />, href: '#', label: 'Telegram' }
  ];

  return (
    <div className="contact-page">
      <div className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Get in touch with us for support, questions, or feedback</p>
        </div>
      </div>

      <div className="container">
        {/* Contact Cards */}
        <motion.div 
          className="contact-cards"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {contactInfo.map((info, index) => (
            <motion.div 
              key={index}
              className={`contact-card card-${info.color}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="card-icon">{info.icon}</div>
              <h3>{info.title}</h3>
              {info.details.map((detail, i) => (
                <p key={i}>{detail}</p>
              ))}
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="contact-content">
          {/* Contact Form */}
          <motion.div 
            className="contact-form-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="section-header">
              <h2>Send Us a Message</h2>
              <p>Fill out the form below and we'll get back to you as soon as possible.</p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form card">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <PersonIcon />
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <EmailIcon />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <SubjectIcon />
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="What is this about?"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <MessageIcon />
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-control"
                  rows="6"
                  placeholder="Write your message here..."
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner spinner-sm"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <SendIcon />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Additional Info */}
          <motion.div 
            className="contact-info-section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* FAQ Section */}
            <div className="info-card card">
              <h3>Frequently Asked Questions</h3>
              <div className="faq-list">
                <div className="faq-item">
                  <h4>How do I report a missing person?</h4>
                  <p>Create an account and click on "Report Missing Person" to submit a detailed report with photos and information.</p>
                </div>
                <div className="faq-item">
                  <h4>Is the service free?</h4>
                  <p>Yes, Afalagi is completely free for all users. We are dedicated to helping reunite families.</p>
                </div>
                <div className="faq-item">
                  <h4>How can I report a sighting?</h4>
                  <p>Visit the missing person's page and click "Report Sighting" to provide details of your sighting.</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="social-card card">
              <h3>Connect With Us</h3>
              <p>Follow us on social media for updates and news.</p>
              <div className="social-links">
                {socialLinks.map((social, index) => (
                  <a 
                    key={index}
                    href={social.href}
                    className="social-link"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Emergency Notice */}
            <div className="emergency-card card">
              <h3>🚨 Emergency?</h3>
              <p>If this is an emergency, please contact the local police immediately:</p>
              <a href="tel:991" className="emergency-number">
                <PhoneIcon />
                Call 991
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
