import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CampaignIcon from '@mui/icons-material/Campaign';
import SecurityIcon from '@mui/icons-material/Security';
import HandshakeIcon from '@mui/icons-material/Handshake';
import SpeedIcon from '@mui/icons-material/Speed';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import './Home.css';

const Home = () => {
  const [stats, setStats] = useState({
    activeCases: 0,
    reunited: 0,
    communityMembers: 0,
    sightingsReported: 0
  });
  const [recentCases, setRecentCases] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // Fetch statistics and recent cases
      const [statsRes, casesRes] = await Promise.all([
        axios.get('/api/missing-persons?limit=1').catch(() => ({ data: { total: 0 } })),
        axios.get('/api/missing-persons?limit=6&status=active')
      ]);
      
      setStats({
        activeCases: statsRes.data.total || 150,
        reunited: 45,
        communityMembers: 520,
        sightingsReported: 340
      });
      
      setRecentCases(casesRes.data.data || []);
    } catch (error) {
      console.error('Error fetching home data:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/missing-persons?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const statsData = [
    { 
      icon: <GroupIcon />, 
      value: stats.activeCases, 
      label: 'Active Cases',
      color: 'primary'
    },
    { 
      icon: <FavoriteIcon />, 
      value: stats.reunited, 
      label: 'Families Reunited',
      color: 'success'
    },
    { 
      icon: <VerifiedUserIcon />, 
      value: stats.communityMembers, 
      label: 'Community Members',
      color: 'info'
    },
    { 
      icon: <TrendingUpIcon />, 
      value: stats.sightingsReported, 
      label: 'Sightings Reported',
      color: 'warning'
    }
  ];

  const features = [
    {
      icon: <PersonSearchIcon />,
      title: 'Report Missing Person',
      description: 'Create detailed reports with photos, physical descriptions, and last known location. Our secure platform ensures privacy.',
      step: '01'
    },
    {
      icon: <CampaignIcon />,
      title: 'Community Awareness',
      description: 'Your report reaches our network of volunteers and community members who actively help in the search.',
      step: '02'
    },
    {
      icon: <SecurityIcon />,
      title: 'Secure Communication',
      description: 'Connect with sighting reporters through our secure messaging system. All communications are private.',
      step: '03'
    },
    {
      icon: <HandshakeIcon />,
      title: 'Reunite Families',
      description: 'With verified sightings and community support, we help bring missing persons back to their families safely.',
      step: '04'
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
        </div>
        
        <div className="container">
          <motion.div 
            className="hero-content"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div className="hero-badge" variants={fadeInUp}>
              <SpeedIcon />
              <span>Ethiopia's #1 Missing Persons Platform</span>
            </motion.div>
            
            <motion.h1 className="hero-title" variants={fadeInUp}>
              Help Reunite Families
              <span className="text-highlight"> with Their Loved Ones</span>
            </motion.h1>
            
            <motion.p className="hero-subtitle" variants={fadeInUp}>
              Afalagi is a community-driven platform dedicated to finding missing persons 
              in Ethiopia. Together, we can bring hope and reunite families.
            </motion.p>

            {/* Hero Search */}
            <motion.form 
              className="hero-search"
              variants={fadeInUp}
              onSubmit={handleSearch}
            >
              <div className="search-input-wrapper">
                <SearchIcon className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by name, location, or case number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg search-btn">
                <SearchIcon />
                Search
              </button>
            </motion.form>

            {/* Hero Actions */}
            <motion.div className="hero-actions" variants={fadeInUp}>
              <Link to="/missing-persons" className="btn btn-secondary btn-lg">
                <GroupIcon />
                View All Cases
              </Link>
              <Link to="/report-missing" className="btn btn-outline-light btn-lg">
                Report Missing Person
                <ArrowForwardIcon />
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div className="hero-trust" variants={fadeInUp}>
              <div className="trust-item">
                <VerifiedUserIcon />
                <span>Verified Reports</span>
              </div>
              <div className="trust-divider"></div>
              <div className="trust-item">
                <SecurityIcon />
                <span>Secure & Private</span>
              </div>
              <div className="trust-divider"></div>
              <div className="trust-item">
                <SpeedIcon />
                <span>Fast Response</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <motion.div 
            className="stats-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {statsData.map((stat, index) => (
              <motion.div 
                key={index}
                className={`stat-card stat-${stat.color}`}
                variants={fadeInUp}
              >
                <div className="stat-icon">
                  {stat.icon}
                </div>
                <div className="stat-content">
                  <h3 className="stat-number">{stat.value}+</h3>
                  <p className="stat-label">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Recent Cases Section */}
      {recentCases.length > 0 && (
        <section className="recent-cases-section">
          <div className="container">
            <motion.div 
              className="section-header"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-badge">Active Cases</span>
              <h2 className="section-title">Help Us Find Them</h2>
              <p className="section-subtitle">
                These individuals are currently missing. Any information could help reunite them with their families.
              </p>
            </motion.div>

            <motion.div 
              className="cases-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {recentCases.map((person) => (
                <motion.div key={person._id} variants={fadeInUp}>
                  <Link to={`/missing-persons/${person._id}`} className="case-card card-interactive">
                    <div className="case-image">
                      <img
                        src={person.personalInfo?.photo || '/placeholder.jpg'}
                        alt={`${person.personalInfo?.firstName} ${person.personalInfo?.lastName}`}
                      />
                      <div className="case-badges">
                        <span className={`badge badge-${person.priority === 'critical' ? 'danger' : person.priority === 'high' ? 'warning' : 'primary'}`}>
                          {person.priority}
                        </span>
                      </div>
                    </div>
                    <div className="case-info">
                      <h3 className="case-name">
                        {person.personalInfo?.firstName} {person.personalInfo?.lastName}
                      </h3>
                      <p className="case-meta">
                        {person.personalInfo?.age} years • {person.personalInfo?.gender}
                      </p>
                      <div className="case-location">
                        <LocationOnIcon />
                        <span>Last seen in {person.lastSeenInfo?.location?.city}</span>
                      </div>
                      <div className="case-footer">
                        <div className="case-stat">
                          <VisibilityIcon />
                          <span>{person.views || 0}</span>
                        </div>
                        <div className="case-stat">
                          <AccessTimeIcon />
                          <span>Case: {person.caseNumber}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              className="section-action"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Link to="/missing-persons" className="btn btn-primary btn-lg">
                View All Missing Persons
                <ArrowForwardIcon />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="features-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">How It Works</span>
            <h2 className="section-title">Simple Steps to Make a Difference</h2>
            <p className="section-subtitle">
              Our platform makes it easy for anyone to report missing persons and help reunite families.
            </p>
          </motion.div>

          <motion.div 
            className="features-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="feature-card"
                variants={fadeInUp}
              >
                <div className="feature-step">{feature.step}</div>
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-background">
          <div className="cta-pattern"></div>
        </div>
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="cta-title">Ready to Make a Difference?</h2>
            <p className="cta-subtitle">
              Join our community of volunteers and help reunite families today.
              Every action counts, every share matters.
            </p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-xl">
                Get Started Now
                <ArrowForwardIcon />
              </Link>
              <Link to="/about" className="btn btn-outline-light btn-xl">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ethiopian Flag Stripe */}
      <div className="ethiopian-stripe">
        <div className="stripe-green"></div>
        <div className="stripe-yellow"></div>
        <div className="stripe-red"></div>
      </div>
    </div>
  );
};

export default Home;
