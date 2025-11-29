import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

// Material Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import GroupIcon from '@mui/icons-material/Group';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SendIcon from '@mui/icons-material/Send';
import InfoIcon from '@mui/icons-material/Info';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import './ReportSighting.css';

const ReportSighting = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [missingPerson, setMissingPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    // Sighting Details
    sightingDate: '',
    sightingTime: '',
    // Location
    city: '',
    subcity: '',
    woreda: '',
    specificLocation: '',
    // Description
    description: '',
    personCondition: 'unknown',
    wasAlone: true,
    companionDescription: '',
    // Contact Attempt
    didAttemptContact: false,
    contactResult: '',
    // Evidence
    photoUrl: '',
    // Privacy
    isAnonymous: false
  });

  const [errors, setErrors] = useState({});

  const fetchMissingPerson = useCallback(async () => {
    try {
      const response = await axios.get(`/api/missing-persons/${id}`);
      setMissingPerson(response.data.data);
      
      if (response.data.data.status !== 'active') {
        toast.warning('This case is no longer active');
        navigate(`/missing-persons/${id}`);
      }
    } catch (error) {
      toast.error('Error loading missing person details');
      navigate('/missing-persons');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchMissingPerson();
  }, [fetchMissingPerson]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.sightingDate) newErrors.sightingDate = 'Date is required';
      if (!formData.sightingTime) newErrors.sightingTime = 'Time is required';
      
      // Validate date is not in the future
      const sightingDateTime = new Date(`${formData.sightingDate}T${formData.sightingTime}`);
      if (sightingDateTime > new Date()) {
        newErrors.sightingDate = 'Sighting cannot be in the future';
      }
    }

    if (step === 2) {
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.specificLocation) newErrors.specificLocation = 'Specific location is required';
    }

    if (step === 3) {
      if (!formData.description) {
        newErrors.description = 'Description is required';
      } else if (formData.description.length < 20) {
        newErrors.description = 'Description must be at least 20 characters';
      }
      
      if (!formData.wasAlone && !formData.companionDescription) {
        newErrors.companionDescription = 'Please describe the companion(s)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;

    setSubmitting(true);

    try {
      const sightingData = {
        missingPerson: id,
        sightingInfo: {
          date: formData.sightingDate,
          time: formData.sightingTime,
          location: {
            city: formData.city,
            subcity: formData.subcity,
            woreda: formData.woreda,
            specificLocation: formData.specificLocation
          },
          description: formData.description,
          personCondition: formData.personCondition,
          wasAlone: formData.wasAlone,
          companionDescription: formData.wasAlone ? '' : formData.companionDescription
        },
        evidence: {
          photos: formData.photoUrl ? [formData.photoUrl] : []
        },
        contactAttempt: {
          didAttemptContact: formData.didAttemptContact,
          contactResult: formData.didAttemptContact ? formData.contactResult : ''
        },
        isAnonymous: formData.isAnonymous
      };

      await axios.post('/api/sightings', sightingData);
      
      toast.success('Sighting reported successfully! Thank you for your help.');
      navigate(`/missing-persons/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting sighting');
    } finally {
      setSubmitting(false);
    }
  };

  const conditionOptions = [
    { value: 'appeared_well', label: 'Appeared Well', description: 'Person seemed healthy and fine' },
    { value: 'appeared_distressed', label: 'Appeared Distressed', description: 'Person seemed upset or anxious' },
    { value: 'appeared_injured', label: 'Appeared Injured', description: 'Person had visible injuries' },
    { value: 'appeared_confused', label: 'Appeared Confused', description: 'Person seemed disoriented' },
    { value: 'unknown', label: 'Unknown / Couldn\'t Tell', description: 'Could not determine condition' }
  ];

  const steps = [
    { number: 1, title: 'When', icon: <CalendarTodayIcon /> },
    { number: 2, title: 'Where', icon: <LocationOnIcon /> },
    { number: 3, title: 'Details', icon: <DescriptionIcon /> },
    { number: 4, title: 'Submit', icon: <SendIcon /> }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner spinner-lg"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!missingPerson) return null;

  return (
    <div className="report-sighting-page">
      {/* Back Link */}
      <div className="container">
        <Link to={`/missing-persons/${id}`} className="back-link">
          <ArrowBackIcon />
          <span>Back to Case Details</span>
        </Link>
      </div>

      <div className="container">
        <div className="sighting-layout">
          {/* Sidebar - Person Info */}
          <motion.div 
            className="sighting-sidebar"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="person-preview card">
              <div className="preview-image">
                <img
                  src={missingPerson.personalInfo.photo || '/placeholder.jpg'}
                  alt={`${missingPerson.personalInfo.firstName} ${missingPerson.personalInfo.lastName}`}
                />
              </div>
              <div className="preview-info">
                <h3>{missingPerson.personalInfo.firstName} {missingPerson.personalInfo.lastName}</h3>
                <p className="preview-case">Case: {missingPerson.caseNumber}</p>
                <p className="preview-meta">
                  {missingPerson.personalInfo.age} years • {missingPerson.personalInfo.gender}
                </p>
                <div className="preview-location">
                  <LocationOnIcon />
                  <span>Last seen in {missingPerson.lastSeenInfo.location.city}</span>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="tips-card card">
              <h4>
                <InfoIcon />
                Tips for Accurate Reporting
              </h4>
              <ul className="tips-list">
                <li>Provide as much detail as possible about the sighting</li>
                <li>Include specific landmarks or addresses</li>
                <li>Describe what the person was wearing</li>
                <li>Note any distinguishing features you observed</li>
                <li>If safe, try to note the direction they were heading</li>
                <li>Include any photos or videos if you have them</li>
              </ul>
            </div>
          </motion.div>

          {/* Main Form */}
          <motion.div 
            className="sighting-main"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Progress Steps */}
            <div className="progress-steps">
              {steps.map((step) => (
                <div 
                  key={step.number}
                  className={`step ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
                >
                  <div className="step-icon">
                    {currentStep > step.number ? <CheckCircleIcon /> : step.icon}
                  </div>
                  <span className="step-title">{step.title}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="sighting-form card">
              {/* Step 1: When */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="form-step"
                >
                  <div className="step-header">
                    <h2>
                      <CalendarTodayIcon />
                      When did you see this person?
                    </h2>
                    <p>Please provide the date and time of the sighting</p>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        <CalendarTodayIcon />
                        Date of Sighting *
                      </label>
                      <input
                        type="date"
                        name="sightingDate"
                        value={formData.sightingDate}
                        onChange={handleChange}
                        className={`form-control ${errors.sightingDate ? 'error' : ''}`}
                        max={new Date().toISOString().split('T')[0]}
                      />
                      {errors.sightingDate && <span className="form-error">{errors.sightingDate}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <AccessTimeIcon />
                        Time of Sighting *
                      </label>
                      <input
                        type="time"
                        name="sightingTime"
                        value={formData.sightingTime}
                        onChange={handleChange}
                        className={`form-control ${errors.sightingTime ? 'error' : ''}`}
                      />
                      {errors.sightingTime && <span className="form-error">{errors.sightingTime}</span>}
                    </div>
                  </div>

                  <div className="info-box">
                    <InfoIcon />
                    <p>Please be as accurate as possible with the time. This helps investigators track the person's movements.</p>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Where */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="form-step"
                >
                  <div className="step-header">
                    <h2>
                      <LocationOnIcon />
                      Where did you see this person?
                    </h2>
                    <p>Provide as much location detail as possible</p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`form-control ${errors.city ? 'error' : ''}`}
                      placeholder="e.g., Addis Ababa"
                    />
                    {errors.city && <span className="form-error">{errors.city}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Sub-city / District</label>
                      <input
                        type="text"
                        name="subcity"
                        value={formData.subcity}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="e.g., Bole"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Woreda / Area</label>
                      <input
                        type="text"
                        name="woreda"
                        value={formData.woreda}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="e.g., Woreda 03"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Specific Location *</label>
                    <textarea
                      name="specificLocation"
                      value={formData.specificLocation}
                      onChange={handleChange}
                      className={`form-control ${errors.specificLocation ? 'error' : ''}`}
                      rows="3"
                      placeholder="Provide specific details: street name, landmark, building, store name, etc."
                    />
                    {errors.specificLocation && <span className="form-error">{errors.specificLocation}</span>}
                    <span className="form-helper">Include any nearby landmarks or notable locations</span>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Details */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="form-step"
                >
                  <div className="step-header">
                    <h2>
                      <DescriptionIcon />
                      Sighting Details
                    </h2>
                    <p>Describe what you observed</p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <DescriptionIcon />
                      Description of Sighting *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className={`form-control ${errors.description ? 'error' : ''}`}
                      rows="5"
                      placeholder="Describe what you saw: what the person was doing, wearing, direction they were heading, any interactions observed, etc."
                    />
                    {errors.description && <span className="form-error">{errors.description}</span>}
                    <span className="form-helper">{formData.description.length}/20 minimum characters</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <HealthAndSafetyIcon />
                      Person's Apparent Condition
                    </label>
                    <div className="condition-options">
                      {conditionOptions.map((option) => (
                        <label 
                          key={option.value}
                          className={`condition-option ${formData.personCondition === option.value ? 'selected' : ''}`}
                        >
                          <input
                            type="radio"
                            name="personCondition"
                            value={option.value}
                            checked={formData.personCondition === option.value}
                            onChange={handleChange}
                          />
                          <div className="option-content">
                            <span className="option-label">{option.label}</span>
                            <span className="option-desc">{option.description}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <GroupIcon />
                      Was the person alone?
                    </label>
                    <div className="toggle-options">
                      <button
                        type="button"
                        className={`toggle-btn ${formData.wasAlone ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, wasAlone: true }))}
                      >
                        <PersonIcon />
                        Yes, alone
                      </button>
                      <button
                        type="button"
                        className={`toggle-btn ${!formData.wasAlone ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, wasAlone: false }))}
                      >
                        <GroupIcon />
                        No, with others
                      </button>
                    </div>
                  </div>

                  {!formData.wasAlone && (
                    <motion.div 
                      className="form-group"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <label className="form-label">Describe the Companion(s) *</label>
                      <textarea
                        name="companionDescription"
                        value={formData.companionDescription}
                        onChange={handleChange}
                        className={`form-control ${errors.companionDescription ? 'error' : ''}`}
                        rows="3"
                        placeholder="Describe the person(s) they were with: gender, age, appearance, etc."
                      />
                      {errors.companionDescription && <span className="form-error">{errors.companionDescription}</span>}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step 4: Submit */}
              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="form-step"
                >
                  <div className="step-header">
                    <h2>
                      <SendIcon />
                      Additional Information & Submit
                    </h2>
                    <p>Add any extra details and submit your report</p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <ContactPhoneIcon />
                      Did you attempt to contact the person?
                    </label>
                    <div className="toggle-options">
                      <button
                        type="button"
                        className={`toggle-btn ${!formData.didAttemptContact ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, didAttemptContact: false }))}
                      >
                        No
                      </button>
                      <button
                        type="button"
                        className={`toggle-btn ${formData.didAttemptContact ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, didAttemptContact: true }))}
                      >
                        Yes
                      </button>
                    </div>
                  </div>

                  {formData.didAttemptContact && (
                    <motion.div 
                      className="form-group"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <label className="form-label">What happened when you approached?</label>
                      <textarea
                        name="contactResult"
                        value={formData.contactResult}
                        onChange={handleChange}
                        className="form-control"
                        rows="3"
                        placeholder="Describe the interaction..."
                      />
                    </motion.div>
                  )}

                  <div className="form-group">
                    <label className="form-label">
                      <PhotoCameraIcon />
                      Photo/Video Evidence (Optional)
                    </label>
                    <input
                      type="url"
                      name="photoUrl"
                      value={formData.photoUrl}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Paste a link to your photo or video"
                    />
                    <span className="form-helper">If you have photos/videos, you can provide a link here</span>
                  </div>

                  <div className="form-group">
                    <label className={`checkbox-label ${formData.isAnonymous ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        name="isAnonymous"
                        checked={formData.isAnonymous}
                        onChange={handleChange}
                      />
                      <VisibilityOffIcon />
                      <div>
                        <span className="checkbox-title">Submit Anonymously</span>
                        <span className="checkbox-desc">Your identity will be hidden from the public</span>
                      </div>
                    </label>
                  </div>

                  <div className="warning-box">
                    <WarningAmberIcon />
                    <p>
                      <strong>Important:</strong> Please only report genuine sightings. 
                      False reports waste valuable resources and give false hope to families.
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="summary-section">
                    <h3>Report Summary</h3>
                    <div className="summary-grid">
                      <div className="summary-item">
                        <span className="summary-label">Date & Time</span>
                        <span className="summary-value">{formData.sightingDate} at {formData.sightingTime}</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Location</span>
                        <span className="summary-value">
                          {formData.specificLocation}, {formData.city}
                        </span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Condition</span>
                        <span className="summary-value">
                          {conditionOptions.find(c => c.value === formData.personCondition)?.label}
                        </span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Alone</span>
                        <span className="summary-value">{formData.wasAlone ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="form-navigation">
                {currentStep > 1 && (
                  <button 
                    type="button" 
                    onClick={handleBack}
                    className="btn btn-outline"
                    disabled={submitting}
                  >
                    <ArrowBackIcon />
                    Back
                  </button>
                )}
                
                {currentStep < 4 ? (
                  <button 
                    type="button" 
                    onClick={handleNext}
                    className="btn btn-primary"
                  >
                    Continue
                  </button>
                ) : (
                  <button 
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <div className="spinner spinner-sm"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <SendIcon />
                        Submit Sighting Report
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReportSighting;
