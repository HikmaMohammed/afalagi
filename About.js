import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Material Icons
import FavoriteIcon from '@mui/icons-material/Favorite';
import SecurityIcon from '@mui/icons-material/Security';
import GroupIcon from '@mui/icons-material/Group';
import SpeedIcon from '@mui/icons-material/Speed';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';

import './About.css';

const About = () => {
  const values = [
    {
      icon: <FavoriteIcon />,
      title: 'Compassion',
      description: 'We understand the emotional trauma families experience when a loved one goes missing. Every feature is designed with empathy and care.'
    },
    {
      icon: <SecurityIcon />,
      title: 'Privacy & Security',
      description: 'We implement the highest standards of data protection to ensure sensitive information is secure and only accessible to authorized individuals.'
    },
    {
      icon: <GroupIcon />,
      title: 'Community',
      description: 'We believe in the power of community. Together, we can achieve what individuals cannot accomplish alone.'
    },
    {
      icon: <SpeedIcon />,
      title: 'Efficiency',
      description: 'Time is critical when someone goes missing. Our platform is designed for rapid information dissemination and response.'
    }
  ];

  const team = [
    {
      name: 'Hikma Mohammed',
      role: 'Full-Stack Developer',
      id: 'RCD/2144/2014',
      image: null
    },
    {
      name: 'Rihana Jemal',
      role: 'Backend Developer',
      id: 'RCD/0897/2014',
      image: null
    },
    {
      name: 'Bethelhem Ashebir',
      role: 'Frontend Developer',
      id: 'RCD/3206/2013',
      image: null
    },
    {
      name: 'Tsedenya Birhanu',
      role: 'UI/UX Designer',
      id: 'RCD/0902/2014',
      image: null
    }
  ];

  const stats = [
    { value: '500+', label: 'Community Members' },
    { value: '150+', label: 'Active Cases' },
    { value: '45', label: 'Families Reunited' },
    { value: '340+', label: 'Sightings Reported' }
  ];

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

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
        </div>
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="hero-icon">
              <PersonSearchIcon />
            </div>
            <h1>About Afalagi</h1>
            <p>
              Afalagi (meaning "finder" in Amharic) is Ethiopia's leading platform 
              dedicated to reuniting missing persons with their families through 
              community-driven search efforts.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-stats">
        <div className="container">
          <motion.div 
            className="stats-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {stats.map((stat, index) => (
              <motion.div key={index} className="stat-item" variants={fadeInUp}>
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-story">
        <div className="container">
          <div className="story-content">
            <motion.div 
              className="story-text"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-badge">Our Story</span>
              <h2>Why We Built Afalagi</h2>
              <p>
                Every year, countless individuals go missing in Ethiopia - children who wander off, 
                elderly people with dementia, or individuals who become disoriented in unfamiliar places. 
                Families are left devastated, searching desperately for their loved ones.
              </p>
              <p>
                We recognized that traditional methods of finding missing persons - word of mouth, 
                physical posters, and fragmented social media posts - were inefficient and often 
                failed to reach the right people at the right time.
              </p>
              <p>
                Afalagi was created to provide a centralized, secure, and efficient platform 
                specifically designed for this sensitive task. Our mission is to leverage 
                technology and community power to bring hope and reunite families.
              </p>
            </motion.div>
            <motion.div 
              className="story-image"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="image-placeholder">
                <FavoriteIcon />
                <span>Reuniting Families</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">Our Core Values</span>
            <h2>What Drives Us</h2>
            <p>Our work is guided by principles that put families first.</p>
          </motion.div>

          <motion.div 
            className="values-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {values.map((value, index) => (
              <motion.div key={index} className="value-card card" variants={fadeInUp}>
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">The Team</span>
            <h2>Meet the Developers</h2>
            <p>The dedicated team behind Afalagi from St. Mary's University.</p>
          </motion.div>

          <motion.div 
            className="team-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {team.map((member, index) => (
              <motion.div key={index} className="team-card" variants={fadeInUp}>
                <div className="member-avatar">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3>{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <p className="member-id">{member.id}</p>
                <div className="member-links">
                  <button type="button" aria-label="LinkedIn"><LinkedInIcon /></button>
                  <button type="button" aria-label="GitHub"><GitHubIcon /></button>
                  <button type="button" aria-label="Email"><EmailIcon /></button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Advisor */}
          <motion.div 
            className="advisor-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="advisor-icon">
              <SchoolIcon />
            </div>
            <div className="advisor-info">
              <span className="advisor-label">Project Advisor</span>
              <h3>Worku Alemu</h3>
              <p>Department of Computer Science, St. Mary's University</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <EmojiEventsIcon className="cta-icon" />
            <h2>Join Our Mission</h2>
            <p>
              Be part of the community making a difference. Help us reunite families 
              and bring hope to those searching for their loved ones.
            </p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started
                <ArrowForwardIcon />
              </Link>
              <Link to="/missing-persons" className="btn btn-outline btn-lg">
                View Cases
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
