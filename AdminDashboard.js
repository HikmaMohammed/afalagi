import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Material Icons
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SettingsIcon from '@mui/icons-material/Settings';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PeopleIcon from '@mui/icons-material/People';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCases: 0,
    activeCases: 0,
    totalSightings: 0,
    pendingVerifications: 0,
    resolvedCases: 0
  });
  const [cases, setCases] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Check if user is admin or moderator
    if (!user || !['admin', 'moderator'].includes(user.role)) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/dashboard');
      return;
    }
    fetchAdminData();
  }, [user, navigate]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data for admin
      const [casesRes] = await Promise.all([
        axios.get('/api/missing-persons?limit=100'),
      ]);

      const allCases = casesRes.data.data || [];
      setCases(allCases);
      
      // Calculate stats
      const activeCases = allCases.filter(c => c.status === 'active').length;
      const resolvedCases = allCases.filter(c => c.status === 'found').length;
      const pendingVerifications = allCases.filter(c => !c.isVerified).length;
      
      setStats({
        totalUsers: 520,
        totalCases: allCases.length,
        activeCases,
        totalSightings: allCases.reduce((sum, c) => sum + (c.sightingsCount || 0), 0),
        pendingVerifications,
        resolvedCases
      });
      
    } catch (error) {
      toast.error('Error loading admin data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCase = async (caseId) => {
    try {
      await axios.put(`/api/missing-persons/${caseId}`, { isVerified: true });
      toast.success('Case verified successfully');
      fetchAdminData();
    } catch (error) {
      toast.error('Error verifying case');
    }
  };

  const handleDeleteCase = async (caseId) => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      try {
        await axios.delete(`/api/missing-persons/${caseId}`);
        toast.success('Case deleted successfully');
        fetchAdminData();
      } catch (error) {
        toast.error('Error deleting case');
      }
    }
  };

  const filteredCases = cases.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const name = `${c.personalInfo.firstName} ${c.personalInfo.lastName}`.toLowerCase();
      if (!name.includes(query) && !c.caseNumber.toLowerCase().includes(query)) return false;
    }
    return true;
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <DashboardIcon /> },
    { id: 'cases', label: 'Cases', icon: <ArticleIcon />, count: cases.length },
    { id: 'verifications', label: 'Verifications', icon: <VerifiedIcon />, count: stats.pendingVerifications },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  const statsCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: <PeopleIcon />, color: 'primary' },
    { title: 'Total Cases', value: stats.totalCases, icon: <ArticleIcon />, color: 'info' },
    { title: 'Active Cases', value: stats.activeCases, icon: <WarningAmberIcon />, color: 'warning' },
    { title: 'Resolved Cases', value: stats.resolvedCases, icon: <CheckCircleIcon />, color: 'success' },
    { title: 'Total Sightings', value: stats.totalSightings, icon: <LocationOnIcon />, color: 'secondary' },
    { title: 'Pending Verifications', value: stats.pendingVerifications, icon: <VerifiedIcon />, color: 'danger' },
  ];

  if (!user || !['admin', 'moderator'].includes(user.role)) {
    return null;
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <div className="admin-title">
                <AdminPanelSettingsIcon />
                <div>
                  <h1>Admin Dashboard</h1>
                  <p>Manage users, cases, and system settings</p>
                </div>
              </div>
            </div>
            <div className="header-actions">
              <span className={`role-badge role-${user.role}`}>
                {user.role.toUpperCase()}
              </span>
              <button onClick={fetchAdminData} className="btn btn-outline btn-sm">
                <RefreshIcon />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="admin-layout">
          {/* Sidebar */}
          <aside className="admin-sidebar">
            <nav className="sidebar-nav">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="nav-badge">{tab.count}</span>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="admin-main">
            {loading ? (
              <div className="loading-container">
                <div className="spinner spinner-lg"></div>
                <p>Loading admin data...</p>
              </div>
            ) : (
              <>
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="admin-content"
                  >
                    {/* Stats Grid */}
                    <div className="admin-stats-grid">
                      {statsCards.map((stat, index) => (
                        <motion.div
                          key={stat.title}
                          className={`admin-stat-card stat-${stat.color}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="stat-icon">{stat.icon}</div>
                          <div className="stat-content">
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-title">{stat.title}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Recent Cases */}
                    <section className="admin-section">
                      <h2 className="section-title">Recent Cases</h2>
                      <div className="cases-table card">
                        <table>
                          <thead>
                            <tr>
                              <th>Person</th>
                              <th>Case Number</th>
                              <th>Status</th>
                              <th>Verified</th>
                              <th>Created</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cases.slice(0, 5).map((c) => (
                              <tr key={c._id}>
                                <td>
                                  <div className="person-cell">
                                    <img src={c.personalInfo.photo || '/placeholder.jpg'} alt="" />
                                    <span>{c.personalInfo.firstName} {c.personalInfo.lastName}</span>
                                  </div>
                                </td>
                                <td><code>{c.caseNumber}</code></td>
                                <td>
                                  <span className={`status-badge status-${c.status}`}>{c.status}</span>
                                </td>
                                <td>
                                  {c.isVerified ? (
                                    <span className="verified-yes"><CheckCircleIcon /> Yes</span>
                                  ) : (
                                    <span className="verified-no"><WarningAmberIcon /> No</span>
                                  )}
                                </td>
                                <td>{format(new Date(c.createdAt), 'MMM d, yyyy')}</td>
                                <td>
                                  <div className="action-buttons">
                                    <button className="icon-btn" onClick={() => navigate(`/missing-persons/${c._id}`)}>
                                      <VisibilityIcon />
                                    </button>
                                    {!c.isVerified && (
                                      <button className="icon-btn success" onClick={() => handleVerifyCase(c._id)}>
                                        <VerifiedIcon />
                                      </button>
                                    )}
                                    <button className="icon-btn danger" onClick={() => handleDeleteCase(c._id)}>
                                      <DeleteIcon />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  </motion.div>
                )}

                {/* Cases Tab */}
                {activeTab === 'cases' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="admin-content"
                  >
                    <div className="content-header">
                      <h2>All Cases</h2>
                      <div className="header-controls">
                        <div className="search-box">
                          <SearchIcon />
                          <input
                            type="text"
                            placeholder="Search cases..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <div className="filter-dropdown">
                          <FilterListIcon />
                          <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                          >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="found">Found</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="cases-table card">
                      <table>
                        <thead>
                          <tr>
                            <th>Person</th>
                            <th>Case Number</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Verified</th>
                            <th>Views</th>
                            <th>Sightings</th>
                            <th>Created</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCases.map((c) => (
                            <tr key={c._id}>
                              <td>
                                <div className="person-cell">
                                  <img src={c.personalInfo.photo || '/placeholder.jpg'} alt="" />
                                  <div>
                                    <span className="person-name">{c.personalInfo.firstName} {c.personalInfo.lastName}</span>
                                    <span className="person-age">{c.personalInfo.age} years • {c.personalInfo.gender}</span>
                                  </div>
                                </div>
                              </td>
                              <td><code>{c.caseNumber}</code></td>
                              <td>
                                <span className={`status-badge status-${c.status}`}>{c.status}</span>
                              </td>
                              <td>
                                <span className={`priority-badge priority-${c.priority}`}>{c.priority}</span>
                              </td>
                              <td>
                                {c.isVerified ? (
                                  <span className="verified-yes"><CheckCircleIcon /></span>
                                ) : (
                                  <span className="verified-no"><WarningAmberIcon /></span>
                                )}
                              </td>
                              <td>{c.views || 0}</td>
                              <td>{c.sightingsCount || 0}</td>
                              <td>{format(new Date(c.createdAt), 'MMM d, yyyy')}</td>
                              <td>
                                <div className="action-buttons">
                                  <button className="icon-btn" onClick={() => navigate(`/missing-persons/${c._id}`)}>
                                    <VisibilityIcon />
                                  </button>
                                  {!c.isVerified && (
                                    <button className="icon-btn success" onClick={() => handleVerifyCase(c._id)}>
                                      <VerifiedIcon />
                                    </button>
                                  )}
                                  <button className="icon-btn danger" onClick={() => handleDeleteCase(c._id)}>
                                    <DeleteIcon />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {/* Verifications Tab */}
                {activeTab === 'verifications' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="admin-content"
                  >
                    <div className="content-header">
                      <h2>Pending Verifications</h2>
                    </div>

                    {cases.filter(c => !c.isVerified).length === 0 ? (
                      <div className="empty-state card">
                        <CheckCircleIcon className="empty-icon success" />
                        <h3>All Caught Up!</h3>
                        <p>No cases pending verification.</p>
                      </div>
                    ) : (
                      <div className="verification-grid">
                        {cases.filter(c => !c.isVerified).map((c) => (
                          <div key={c._id} className="verification-card card">
                            <div className="verification-header">
                              <img src={c.personalInfo.photo || '/placeholder.jpg'} alt="" />
                              <div>
                                <h3>{c.personalInfo.firstName} {c.personalInfo.lastName}</h3>
                                <p>{c.caseNumber}</p>
                              </div>
                            </div>
                            <div className="verification-info">
                              <p><strong>Age:</strong> {c.personalInfo.age} years</p>
                              <p><strong>Last Seen:</strong> {c.lastSeenInfo.location.city}</p>
                              <p><strong>Reported:</strong> {format(new Date(c.createdAt), 'MMM d, yyyy')}</p>
                            </div>
                            <div className="verification-actions">
                              <button 
                                className="btn btn-primary btn-sm"
                                onClick={() => handleVerifyCase(c._id)}
                              >
                                <VerifiedIcon />
                                Verify
                              </button>
                              <button 
                                className="btn btn-outline btn-sm"
                                onClick={() => navigate(`/missing-persons/${c._id}`)}
                              >
                                <VisibilityIcon />
                                Review
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="admin-content"
                  >
                    <div className="content-header">
                      <h2>System Settings</h2>
                    </div>

                    <div className="settings-grid">
                      <div className="settings-card card">
                        <h3><SettingsIcon /> General Settings</h3>
                        <div className="setting-item">
                          <div className="setting-info">
                            <span className="setting-label">Site Name</span>
                            <span className="setting-value">Afalagi - Missing Persons Platform</span>
                          </div>
                        </div>
                        <div className="setting-item">
                          <div className="setting-info">
                            <span className="setting-label">Contact Email</span>
                            <span className="setting-value">info@afalagi.et</span>
                          </div>
                        </div>
                        <div className="setting-item">
                          <div className="setting-info">
                            <span className="setting-label">Support Phone</span>
                            <span className="setting-value">+251 911 234 567</span>
                          </div>
                        </div>
                      </div>

                      <div className="settings-card card">
                        <h3><VerifiedIcon /> Verification Settings</h3>
                        <div className="setting-item">
                          <div className="setting-info">
                            <span className="setting-label">Auto-verify Reports</span>
                            <span className="setting-value">Disabled</span>
                          </div>
                        </div>
                        <div className="setting-item">
                          <div className="setting-info">
                            <span className="setting-label">Require Email Verification</span>
                            <span className="setting-value">Enabled</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

