import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import styles from './settings.module.css';
import iconDelete from '../../assets/nav-trash.svg';

export default function Settings() {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const [user, setUser] = useState({ profiles: {} });

  useEffect(() => {
    const storedUser = localStorage.getItem('user') || localStorage.getItem('User');

    if(!storedUser){
      return;
    }

    try{
      setUser(JSON.parse(storedUser));
    } catch (error) {
      console.warn('Filed to parse user from localStorage', error);
    }
  }, []);

  const userEmail = user.email || 'No email provided';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const handleUpdate = () => {
    toast.error("This functionality is not yet implemented.")
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
              value={userEmail}
              onChange={handleInputChange}
              className={styles.input}
              placeholder={userEmail}
            />
          </div>

          <div className={styles.settingItem}>
            <label htmlFor="password" className={styles.settingLabel}>Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value=""
              onChange={handleInputChange}
              className={styles.input}
              placeholder="••••••••"
            />
          </div>

          <div className={styles.submitMargin}>
            <button type="submit" className={styles.submit} onClick={handleUpdate}>Save</button>
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
              <img src={iconDelete} alt="" className={styles.userTrashIcon} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
