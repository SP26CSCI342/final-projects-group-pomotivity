import { useState } from 'react';
import styles from './settings.module.css';

export default function Settings() {
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

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Deleting account...');
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
        {/* General Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>General</h2>

          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>24h Time</label>
            <div className={styles.toggleWrapper}>
              <button
                className={`${styles.toggle} ${formData.use24hTime ? styles.toggleActive : ''}`}
                onClick={() => handleToggle('use24hTime')}
                aria-label="Toggle 24h time format"
              >
                <div className={styles.toggleThumb} />
              </button>
            </div>
          </div>

          <div className={styles.settingItem}>
            <label htmlFor="dateFormat" className={styles.settingLabel}>Date Format</label>
            <select
              id="dateFormat"
              name="dateFormat"
              value={formData.dateFormat}
              onChange={handleSelectChange}
              className={styles.dropdown}
            >
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>

          <div className={styles.settingItem}>
            <label htmlFor="theme" className={styles.settingLabel}>Theme</label>
            <select
              id="theme"
              name="theme"
              value={formData.theme}
              onChange={handleSelectChange}
              className={styles.dropdown}
            >
              <option>Light</option>
              <option>Dark</option>
              <option>Auto</option>
            </select>
          </div>

          <div className={styles.settingItem}>
            <label htmlFor="textSize" className={styles.settingLabel}>Text Size</label>
            <select
              id="textSize"
              name="textSize"
              value={formData.textSize}
              onChange={handleSelectChange}
              className={styles.dropdown}
            >
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>
          </div>
        </div>

        {/* Profile Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Profile</h2>

          <div className={styles.settingItem}>
            <label htmlFor="name" className={styles.settingLabel}>Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Your name"
            />
          </div>

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

          <div className={styles.settingItem}>
            <label htmlFor="photo" className={styles.settingLabel}>Photo</label>
            <div className={styles.photoUploadWrapper}>
              <input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className={styles.fileInput}
              />
              <label htmlFor="photo" className={styles.uploadButton}>
                <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
              </label>
            </div>
          </div>
        </div>

        {/* Data & Privacy Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Data & Privacy</h2>

          <div className={styles.actionItem}>
            <span className={styles.actionLabel}>Database Account info</span>
            <button
              className={styles.linkButton}
              onClick={() => handleLinkClick('database-account')}
              aria-label="View database account info"
            >
              <svg className={styles.linkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </button>
          </div>

          <div className={styles.actionItem}>
            <span className={styles.actionLabel}>User Agreement</span>
            <button
              className={styles.linkButton}
              onClick={() => handleLinkClick('user-agreement')}
              aria-label="View user agreement"
            >
              <svg className={styles.linkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </button>
          </div>

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

          <div className={styles.actionItem}>
            <span className={styles.actionLabel}>Secrets</span>
            <button
              className={styles.iconButton}
              onClick={handleSecretsClick}
              aria-label="Manage secrets"
            >
              <svg className={styles.keyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="7.5" cy="15.5" r="5.5" />
                <path d="M21 2l-9.6 9.6M15.5 7.5l3 3M2 21l9.6-9.6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Connections Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Connections</h2>

          <div className={styles.actionItem}>
            <span className={styles.actionLabel}>Secrets (API keys)</span>
            <button
              className={styles.iconButton}
              onClick={handleSecretsClick}
              aria-label="Manage API keys"
            >
              <svg className={styles.keyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="7.5" cy="15.5" r="5.5" />
                <path d="M21 2l-9.6 9.6M15.5 7.5l3 3M2 21l9.6-9.6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
