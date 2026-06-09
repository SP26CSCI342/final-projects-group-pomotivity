import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './settings.module.css';

export default function Settings() {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const [formData, setFormData] = useState({
    use24hTime: true,
    dateFormat: 'MM/DD/YYYY',
    theme: 'Light',
    textSize: 'Medium',
    name: 'John Doe',
    email: 'john@example.com',
    password: '',
  });

  const handleToggle = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Photo uploaded:', file.name);
    }
  };

  const handleLinkClick = (link) => {
    console.log('Opening:', link);
    // Implement navigation or external link opening
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmed) return;

    const token = localStorage.getItem('token');

    if (!token) {
      window.alert('You are not logged in.');
      navigate('/login', { replace: true });
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/delete-account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Unable to delete your account right now.');
      }

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('User');

      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Delete account error:', error);
      window.alert(error.message || 'Unable to delete your account right now.');
    }
  };

  const handleSecretsClick = () => {
    console.log('Opening secrets/API keys...');
  };

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsHeader}>
        <h1 className={styles.settingsTitle}>Settings</h1>
      </div>

      <div className={styles.settingsContent}>

        {/* Profile Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Profile</h2>

          <div className={styles.settingItem}>
            <label htmlFor="email" className={styles.settingLabel}>Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="your.email@example.com"
            />
          </div>

          <div className={styles.settingItem}>
            <label htmlFor="password" className={styles.settingLabel}>Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="••••••••"
            />
          </div>

          <div className={styles.submitMargin}>
            <button type="submit" className={styles.submit}>Submit</button>
          </div>

        </div>

        {/* Data & Privacy Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Data & Privacy</h2>

          <div className={styles.actionItem}>
            <span className={styles.actionLabel}>Delete Account</span>
            <button
              className={styles.deleteButton}
              onClick={handleDeleteAccount}
              aria-label="Delete account"
            >
              <svg className={styles.deleteIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8 3a4 4 0 0 1 4 4v1M1 9h6M3 9l1 12h4l1-12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
