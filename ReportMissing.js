import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

// Material Icons
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import HeightIcon from '@mui/icons-material/Height';
import ScaleIcon from '@mui/icons-material/Scale';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoIcon from '@mui/icons-material/Info';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import './ReportMissing.css';

const ReportMissing = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: 'Male',
    photo: '',
    height: '',
    weight: '',
    lastSeenDate: '',
    lastSeenCity: '',
    lastSeenLocation: '',
    circumstances: '',
    primaryContactName: '',
    primaryContactPhone: '',
    primaryContactRelationship: ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        // Also set the photo URL in formData for backward compatibility
        setFormData({ ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setFormData({ ...formData, photo: '' });
    // Reset file input
    const fileInput = document.querySelector('input[type="file"][name="photo"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use photo preview (base64) if available, otherwise use URL or placeholder
      const photoUrl = photoPreview || formData.photo || 'https://via.placeholder.com/400x500?text=No+Photo';
      
      const reportData = {
        personalInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          age: parseInt(formData.age),
          gender: formData.gender,
          photo: photoUrl
        },
        physicalDescription: {
          height: formData.height ? parseInt(formData.height) : undefined,
          weight: formData.weight ? parseInt(formData.weight) : undefined
        },
        lastSeenInfo: {
          date: formData.lastSeenDate,
          location: {
            city: formData.lastSeenCity,
            specificLocation: formData.lastSeenLocation
          },
          circumstances: formData.circumstances
        },
        contactInfo: {
          primaryContact: {
            name: formData.primaryContactName,
            phone: formData.primaryContactPhone,
            relationship: formData.primaryContactRelationship
          }
        }
      };

      const response = await axios.post('/api/missing-persons', reportData);
      toast.success('Missing person report submitted successfully!');
      navigate(`/missing-persons/${response.data.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting report');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-missing-page">
      <div className="page-header">
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Report Missing Person
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Please provide as much detail as possible to help us find your loved one
          </motion.p>
        </div>
      </div>

      <div className="container">
        <div className="report-layout">
          <motion.form 
            onSubmit={handleSubmit} 
            className="report-form card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
          {/* Personal Information */}
          <div className="form-section">
            <h2 className="section-title">
              <PersonIcon />
              Personal Information
            </h2>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="form-control"
                  min="0"
                  max="150"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <PhotoCameraIcon />
                Photo *
              </label>
              
              {!photoPreview ? (
                <div className="photo-upload-area">
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="photo-input"
                    id="photo-upload"
                    required
                  />
                  <label htmlFor="photo-upload" className="photo-upload-label">
                    <CloudUploadIcon className="upload-icon" />
                    <div>
                      <h4>Click to upload or drag and drop</h4>
                      <p>PNG, JPG, GIF up to 5MB</p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="photo-preview-container">
                  <div className="photo-preview">
                    <img src={photoPreview} alt="Preview" />
                    <button
                      type="button"
                      className="remove-photo-btn"
                      onClick={handleRemovePhoto}
                      aria-label="Remove photo"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={handleRemovePhoto}
                  >
                    Change Photo
                  </button>
                </div>
              )}
              
              <span className="form-helper">
                {!photoPreview && 'Upload a clear, recent photo of the missing person'}
              </span>
            </div>
          </div>

          {/* Physical Description */}
          <div className="form-section">
            <h2 className="section-title">
              <HeightIcon />
              Physical Description
            </h2>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <HeightIcon />
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g., 170"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <ScaleIcon />
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g., 65"
                />
              </div>
            </div>
          </div>

          {/* Last Seen Information */}
          <div className="form-section">
            <h2 className="section-title">
              <LocationOnIcon />
              Last Seen Information
            </h2>
            <div className="form-group">
              <label className="form-label">
                <CalendarTodayIcon />
                Last Seen Date *
              </label>
              <input
                type="date"
                name="lastSeenDate"
                value={formData.lastSeenDate}
                onChange={handleChange}
                className="form-control"
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  name="lastSeenCity"
                  value={formData.lastSeenCity}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g., Addis Ababa"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Specific Location *</label>
                <input
                  type="text"
                  name="lastSeenLocation"
                  value={formData.lastSeenLocation}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g., Bole, near Edna Mall"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <DescriptionIcon />
                Circumstances *
              </label>
              <textarea
                name="circumstances"
                value={formData.circumstances}
                onChange={handleChange}
                className="form-control"
                rows="4"
                placeholder="Describe the circumstances under which the person went missing..."
                required
              ></textarea>
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-section">
            <h2 className="section-title">
              <ContactPhoneIcon />
              Primary Contact Information
            </h2>
            <div className="form-group">
              <label className="form-label">
                <PersonIcon />
                Contact Name *
              </label>
              <input
                type="text"
                name="primaryContactName"
                value={formData.primaryContactName}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <ContactPhoneIcon />
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  name="primaryContactPhone"
                  value={formData.primaryContactPhone}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="+251911234567"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Relationship *</label>
                <input
                  type="text"
                  name="primaryContactRelationship"
                  value={formData.primaryContactRelationship}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g., Mother, Brother"
                  required
                />
              </div>
            </div>
          </div>

          <div className="important-notice">
            <WarningAmberIcon />
            <p>
              <strong>Important:</strong> Please ensure all information is accurate. 
              False reports waste valuable resources and give false hope to families.
            </p>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-outline"
              disabled={loading}
            >
              <ArrowBackIcon />
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner spinner-sm"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <SendIcon />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </motion.form>

        {/* Tips Sidebar */}
        <motion.aside 
          className="report-tips"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="tips-card card">
            <h3>
              <InfoIcon />
              Tips for Accurate Reporting
            </h3>
            <ul className="tips-list">
              <li>Provide a clear, recent photo of the missing person</li>
              <li>Include all physical characteristics and distinguishing features</li>
              <li>Be specific about the last known location and time</li>
              <li>Include what the person was wearing when last seen</li>
              <li>Provide accurate contact information for follow-up</li>
              <li>Include any medical conditions or special needs</li>
            </ul>
          </div>
        </motion.aside>
      </div>
      </div>
    </div>
  );
};

export default ReportMissing;
