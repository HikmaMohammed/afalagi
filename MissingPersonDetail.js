import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format, formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';

// Material Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import HeightIcon from '@mui/icons-material/Height';
import ScaleIcon from '@mui/icons-material/Scale';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShareIcon from '@mui/icons-material/Share';
import PrintIcon from '@mui/icons-material/Print';
import FlagIcon from '@mui/icons-material/Flag';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import VerifiedIcon from '@mui/icons-material/Verified';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BadgeIcon from '@mui/icons-material/Badge';
import FaceIcon from '@mui/icons-material/Face';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import './MissingPersonDetail.css';

const MissingPersonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [person, setPerson] = useState(null);
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showFoundModal, setShowFoundModal] = useState(false);
  const [foundData, setFoundData] = useState({ foundLocation: '', notes: '' });

  const fetchPersonDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/missing-persons/${id}`);
      setPerson(response.data.data);
      setSightings(response.data.sightings || []);
    } catch (error) {
      toast.error('Error loading person details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPersonDetails();
  }, [fetchPersonDetails]);

  const handleShare = async (platform) => {
    const url = window.location.href;
    const text = `Help find ${person.personalInfo.firstName} ${person.personalInfo.lastName}. Last seen in ${person.lastSeenInfo.location.city}. Case: ${person.caseNumber}`;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
    };

    if (platform === 'copy') {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    setShowShareModal(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleMarkAsFound = async () => {
    try {
      await axios.put(`/api/missing-persons/${id}/found`, foundData);
      toast.success('Person marked as found successfully!');
      fetchPersonDetails();
      setShowFoundModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating status');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      try {
        await axios.delete(`/api/missing-persons/${id}`);
        toast.success('Report deleted successfully');
        navigate('/missing-persons');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error deleting report');
      }
    }
  };

  const isOwner = user && person && person.reportedBy?._id === user._id;
  const isAdmin = user && ['admin', 'moderator'].includes(user.role);
  const canModify = isOwner || isAdmin;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner spinner-lg"></div>
        <p>Loading details...</p>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="error-container">
        <WarningAmberIcon className="error-icon" />
        <h2>Person Not Found</h2>
        <p>The missing person you're looking for doesn't exist or has been removed.</p>
        <Link to="/missing-persons" className="btn btn-primary">
          <ArrowBackIcon />
          Back to Missing Persons
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'details', label: 'Details', icon: <DescriptionIcon /> },
    { id: 'sightings', label: `Sightings (${sightings.length})`, icon: <LocationOnIcon /> },
    { id: 'medical', label: 'Medical Info', icon: <LocalHospitalIcon /> },
  ];

  return (
    <div className="person-detail-page">
      {/* Back Button */}
      <div className="container">
        <Link to="/missing-persons" className="back-link">
          <ArrowBackIcon />
          <span>Back to Missing Persons</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="detail-layout">
          {/* Left Column - Photo and Quick Info */}
          <motion.div 
            className="detail-sidebar"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Photo Card */}
            <div className="photo-card card">
              <div className="photo-container">
                <img
                  src={person.personalInfo.photo || '/placeholder.jpg'}
                  alt={`${person.personalInfo.firstName} ${person.personalInfo.lastName}`}
                />
                <div className="status-overlay">
                  <span className={`status-badge status-${person.status}`}>
                    {person.status === 'active' && <WarningAmberIcon />}
                    {person.status === 'found' && <CheckCircleIcon />}
                    {person.status === 'closed' && <CancelIcon />}
                    {person.status.charAt(0).toUpperCase() + person.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="photo-info">
                <h1 className="person-name">
                  {person.personalInfo.firstName} {person.personalInfo.middleName || ''} {person.personalInfo.lastName}
                </h1>
                <p className="case-number">
                  <BadgeIcon />
                  Case: {person.caseNumber}
                </p>
                
                {person.isVerified && (
                  <div className="verified-badge">
                    <VerifiedIcon />
                    <span>Verified Report</span>
                  </div>
                )}
              </div>
              
              {/* Quick Stats */}
              <div className="quick-stats">
                <div className="quick-stat">
                  <VisibilityIcon />
                  <span>{person.views} views</span>
                </div>
                <div className="quick-stat">
                  <LocationOnIcon />
                  <span>{person.sightingsCount} sightings</span>
                </div>
                <div className="quick-stat">
                  <AccessTimeIcon />
                  <span>{formatDistanceToNow(new Date(person.createdAt))} ago</span>
                </div>
              </div>
              
              {/* Priority Badge */}
              <div className={`priority-banner priority-${person.priority}`}>
                <FlagIcon />
                <span>{person.priority.charAt(0).toUpperCase() + person.priority.slice(1)} Priority</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              {isAuthenticated && person.status === 'active' && (
                <Link to={`/report-sighting/${id}`} className="btn btn-primary btn-block">
                  <AddLocationIcon />
                  Report a Sighting
                </Link>
              )}
              
              <button onClick={() => setShowShareModal(true)} className="btn btn-secondary btn-block">
                <ShareIcon />
                Share This Case
              </button>
              
              <button onClick={handlePrint} className="btn btn-outline btn-block">
                <PrintIcon />
                Print Poster
              </button>
            </div>

            {/* Owner Actions */}
            {canModify && (
              <div className="owner-actions card">
                <h4>Manage Report</h4>
                <div className="owner-buttons">
                  <Link to={`/edit-report/${id}`} className="btn btn-outline btn-sm">
                    <EditIcon />
                    Edit
                  </Link>
                  {person.status === 'active' && (
                    <button onClick={() => setShowFoundModal(true)} className="btn btn-secondary btn-sm">
                      <CheckCircleIcon />
                      Mark Found
                    </button>
                  )}
                  <button onClick={handleDelete} className="btn btn-danger btn-sm">
                    <DeleteIcon />
                    Delete
                  </button>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="contact-card card">
              <h3>
                <PhoneIcon />
                Contact Information
              </h3>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-label">Primary Contact</span>
                  <span className="contact-value">{person.contactInfo.primaryContact.name}</span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Relationship</span>
                  <span className="contact-value">{person.contactInfo.primaryContact.relationship}</span>
                </div>
                <a href={`tel:${person.contactInfo.primaryContact.phone}`} className="btn btn-primary btn-block">
                  <PhoneIcon />
                  Call {person.contactInfo.primaryContact.phone}
                </a>
                {person.contactInfo.primaryContact.email && (
                  <a href={`mailto:${person.contactInfo.primaryContact.email}`} className="btn btn-outline btn-block">
                    <EmailIcon />
                    Send Email
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Detailed Information */}
          <motion.div 
            className="detail-main"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Tabs */}
            <div className="detail-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {/* Details Tab */}
              {activeTab === 'details' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Personal Information */}
                  <div className="info-section card">
                    <h3>
                      <PersonIcon />
                      Personal Information
                    </h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Age</span>
                        <span className="info-value">{person.personalInfo.age} years old</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Gender</span>
                        <span className="info-value">{person.personalInfo.gender}</span>
                      </div>
                      {person.personalInfo.dateOfBirth && (
                        <div className="info-item">
                          <span className="info-label">Date of Birth</span>
                          <span className="info-value">
                            {format(new Date(person.personalInfo.dateOfBirth), 'MMMM d, yyyy')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Physical Description */}
                  <div className="info-section card">
                    <h3>
                      <FaceIcon />
                      Physical Description
                    </h3>
                    <div className="info-grid">
                      {person.physicalDescription?.height && (
                        <div className="info-item">
                          <HeightIcon className="info-icon" />
                          <div>
                            <span className="info-label">Height</span>
                            <span className="info-value">{person.physicalDescription.height} cm</span>
                          </div>
                        </div>
                      )}
                      {person.physicalDescription?.weight && (
                        <div className="info-item">
                          <ScaleIcon className="info-icon" />
                          <div>
                            <span className="info-label">Weight</span>
                            <span className="info-value">{person.physicalDescription.weight} kg</span>
                          </div>
                        </div>
                      )}
                      {person.physicalDescription?.skinTone && (
                        <div className="info-item">
                          <ColorLensIcon className="info-icon" />
                          <div>
                            <span className="info-label">Skin Tone</span>
                            <span className="info-value">{person.physicalDescription.skinTone}</span>
                          </div>
                        </div>
                      )}
                      {person.physicalDescription?.hairColor && (
                        <div className="info-item">
                          <span className="info-label">Hair Color</span>
                          <span className="info-value">{person.physicalDescription.hairColor}</span>
                        </div>
                      )}
                      {person.physicalDescription?.eyeColor && (
                        <div className="info-item">
                          <RemoveRedEyeIcon className="info-icon" />
                          <div>
                            <span className="info-label">Eye Color</span>
                            <span className="info-value">{person.physicalDescription.eyeColor}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    {person.physicalDescription?.distinguishingFeatures && (
                      <div className="info-full">
                        <span className="info-label">Distinguishing Features</span>
                        <p className="info-text">{person.physicalDescription.distinguishingFeatures}</p>
                      </div>
                    )}
                    {person.physicalDescription?.clothing && (
                      <div className="info-full">
                        <span className="info-label">Last Known Clothing</span>
                        <p className="info-text">{person.physicalDescription.clothing}</p>
                      </div>
                    )}
                  </div>

                  {/* Last Seen Information */}
                  <div className="info-section card highlight-section">
                    <h3>
                      <LocationOnIcon />
                      Last Seen Information
                    </h3>
                    <div className="last-seen-grid">
                      <div className="last-seen-item">
                        <CalendarTodayIcon />
                        <div>
                          <span className="info-label">Date</span>
                          <span className="info-value">
                            {format(new Date(person.lastSeenInfo.date), 'MMMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                      {person.lastSeenInfo.time && (
                        <div className="last-seen-item">
                          <AccessTimeIcon />
                          <div>
                            <span className="info-label">Time</span>
                            <span className="info-value">{person.lastSeenInfo.time}</span>
                          </div>
                        </div>
                      )}
                      <div className="last-seen-item full-width">
                        <LocationOnIcon />
                        <div>
                          <span className="info-label">Location</span>
                          <span className="info-value">
                            {person.lastSeenInfo.location.specificLocation}
                            {person.lastSeenInfo.location.subcity && `, ${person.lastSeenInfo.location.subcity}`}
                            {person.lastSeenInfo.location.woreda && `, ${person.lastSeenInfo.location.woreda}`}
                            , {person.lastSeenInfo.location.city}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="circumstances">
                      <h4>Circumstances</h4>
                      <p>{person.lastSeenInfo.circumstances}</p>
                    </div>
                  </div>

                  {/* Reported By */}
                  {person.reportedBy && (
                    <div className="info-section card">
                      <h3>
                        <PersonIcon />
                        Reported By
                      </h3>
                      <div className="reporter-info">
                        <div className="reporter-avatar">
                          {person.reportedBy.firstName?.charAt(0)}{person.reportedBy.lastName?.charAt(0)}
                        </div>
                        <div className="reporter-details">
                          <span className="reporter-name">
                            {person.reportedBy.firstName} {person.reportedBy.lastName}
                          </span>
                          <span className="reporter-date">
                            Reported on {format(new Date(person.createdAt), 'MMMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Sightings Tab */}
              {activeTab === 'sightings' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {sightings.length === 0 ? (
                    <div className="empty-sightings card">
                      <LocationOnIcon className="empty-icon" />
                      <h3>No Sightings Reported Yet</h3>
                      <p>Be the first to report if you've seen this person.</p>
                      {isAuthenticated && person.status === 'active' && (
                        <Link to={`/report-sighting/${id}`} className="btn btn-primary">
                          <AddLocationIcon />
                          Report a Sighting
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="sightings-list">
                      {sightings.map((sighting, index) => (
                        <div key={sighting._id} className="sighting-card card">
                          <div className="sighting-header">
                            <div className="sighting-meta">
                              <span className={`sighting-status badge badge-${sighting.status === 'verified' ? 'success' : sighting.status === 'investigating' ? 'warning' : 'secondary'}`}>
                                {sighting.status}
                              </span>
                              <span className="sighting-date">
                                {format(new Date(sighting.sightingInfo.date), 'MMM d, yyyy')} at {sighting.sightingInfo.time}
                              </span>
                            </div>
                            <span className="sighting-number">#{index + 1}</span>
                          </div>
                          <div className="sighting-location">
                            <LocationOnIcon />
                            <span>
                              {sighting.sightingInfo.location.specificLocation}, {sighting.sightingInfo.location.city}
                            </span>
                          </div>
                          <p className="sighting-description">{sighting.sightingInfo.description}</p>
                          <div className="sighting-details">
                            <span className="sighting-condition">
                              Condition: {sighting.sightingInfo.personCondition?.replace(/_/g, ' ') || 'Unknown'}
                            </span>
                            <span className="sighting-alone">
                              {sighting.sightingInfo.wasAlone ? 'Was alone' : 'Was with others'}
                            </span>
                          </div>
                          {sighting.reportedBy && !sighting.isAnonymous && (
                            <div className="sighting-reporter">
                              Reported by {sighting.reportedBy.firstName} {sighting.reportedBy.lastName}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Medical Tab */}
              {activeTab === 'medical' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="info-section card">
                    <h3>
                      <LocalHospitalIcon />
                      Medical Information
                    </h3>
                    {person.medicalInfo?.hasCondition ? (
                      <>
                        {person.medicalInfo.conditions?.length > 0 && (
                          <div className="medical-item">
                            <span className="info-label">Medical Conditions</span>
                            <div className="tag-list">
                              {person.medicalInfo.conditions.map((condition, i) => (
                                <span key={i} className="tag tag-warning">{condition}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {person.medicalInfo.medications?.length > 0 && (
                          <div className="medical-item">
                            <span className="info-label">Medications</span>
                            <div className="tag-list">
                              {person.medicalInfo.medications.map((med, i) => (
                                <span key={i} className="tag tag-info">{med}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {person.medicalInfo.allergies?.length > 0 && (
                          <div className="medical-item">
                            <span className="info-label">Allergies</span>
                            <div className="tag-list">
                              {person.medicalInfo.allergies.map((allergy, i) => (
                                <span key={i} className="tag tag-danger">{allergy}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {person.medicalInfo.requiresAssistance && (
                          <div className="assistance-alert">
                            <WarningAmberIcon />
                            <span>This person may require immediate medical assistance</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="no-medical-info">No medical conditions reported</p>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <motion.div 
            className="modal-content share-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Share This Case</h3>
            <p>Help spread the word about {person.personalInfo.firstName}</p>
            <div className="share-buttons">
              <button onClick={() => handleShare('facebook')} className="share-btn facebook">
                Facebook
              </button>
              <button onClick={() => handleShare('twitter')} className="share-btn twitter">
                Twitter
              </button>
              <button onClick={() => handleShare('whatsapp')} className="share-btn whatsapp">
                WhatsApp
              </button>
              <button onClick={() => handleShare('telegram')} className="share-btn telegram">
                Telegram
              </button>
              <button onClick={() => handleShare('copy')} className="share-btn copy">
                Copy Link
              </button>
            </div>
            <button onClick={() => setShowShareModal(false)} className="btn btn-outline">
              Close
            </button>
          </motion.div>
        </div>
      )}

      {/* Found Modal */}
      {showFoundModal && (
        <div className="modal-overlay" onClick={() => setShowFoundModal(false)}>
          <motion.div 
            className="modal-content found-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Mark as Found</h3>
            <p>Great news! Please provide details about how {person.personalInfo.firstName} was found.</p>
            <div className="form-group">
              <label className="form-label">Where was the person found?</label>
              <input
                type="text"
                className="form-control"
                placeholder="Location where found"
                value={foundData.foundLocation}
                onChange={(e) => setFoundData({ ...foundData, foundLocation: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Additional Notes</label>
              <textarea
                className="form-control"
                placeholder="Any additional information..."
                rows="3"
                value={foundData.notes}
                onChange={(e) => setFoundData({ ...foundData, notes: e.target.value })}
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowFoundModal(false)} className="btn btn-outline">
                Cancel
              </button>
              <button onClick={handleMarkAsFound} className="btn btn-primary">
                Confirm Found
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MissingPersonDetail;
