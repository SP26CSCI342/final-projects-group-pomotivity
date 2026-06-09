import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import avatar from '../../assets/profile-avatar.svg';
import iconEnvelope from '../../assets/icon-envelope.svg';
import iconEdit from '../../assets/icon-edit.svg';
import iconClockStat from '../../assets/icon-clock-stat.svg';
import iconFlame from '../../assets/icon-flame.svg';
import iconCheckCircle from '../../assets/icon-check-circle.svg';
import iconArrowRight from '../../assets/icon-arrow-right.svg';
import badgeSun from '../../assets/badge-sun.svg';
import badgeTarget from '../../assets/badge-target.svg';
import badgeCalendar from '../../assets/badge-calendar.svg';
import badgeLock from '../../assets/badge-lock.svg';
import iconMoon from '../../assets/icon-moon.svg';
import iconChevronDown from '../../assets/icon-chevron-down-sm.svg';
import styles from './profile.module.css';

const badgeIcons = {
  'Early Bird': badgeSun,
  'Deep Work Master': badgeTarget,
  'Consistency King': badgeCalendar,
  '100h Club': badgeLock,
};

function Toggle({ on, onToggle, ariaLabel }) {
  return (
    <button
      type="button"
      className={`${styles.toggle} ${on ? styles.toggleOn : ''}`}
      aria-pressed={on}
      aria-label={ariaLabel}
      onClick={() => onToggle && onToggle(!on)}
    >
      <span className={styles.toggleKnob} />
    </button>
  );
}

export default function Profile() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const [user, setUser] = useState({ profiles: {} });
  const [loadingPref, setLoadingPref] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user') || localStorage.getItem('User');

    if (!storedUser) {
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch (error) {
      console.warn('Failed to parse user from localStorage', error);
    }
  }, []);

  const profile = user.profiles || {};
  const preferences = profile.preferences || {};
  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : 'Recently';
  const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'Guest User';
  const userEmail = user.email || 'No email provided';

  const stats = [
    {
      label: 'Total Focus Hours',
      value: profile.hoursFocused || '0',
      unit: 'h',
      icon: iconClockStat,
    },
    {
      label: 'Current Streak',
      value: profile.currentStreak || '0',
      unit: 'days',
      icon: iconFlame,
      iconClass: 'statIconStreak',
    },
    {
      label: 'Tasks Completed',
      value: profile.tasksCompleted || '0',
      unit: '',
      icon: iconCheckCircle,
    },
  ];

  const badgesList = (profile.badges || []).map((badgeName) => ({
    label: badgeName,
    icon: badgeIcons[badgeName] || badgeSun,
    state: 'active',
  }));

  const prefs = [
    {
      type: 'toggle',
      label: 'Push Notifications',
      desc: 'Receive alerts for session starts and ends.',
      on: preferences.pushNotifications !== false,
      key: 'pushNotifications',
    },
    {
      type: 'toggle',
      label: 'Weekly Email Report',
      desc: 'Get a summary of your focus hours every Monday.',
      on: preferences.weeklyEmailReport !== false,
      key: 'weeklyEmailReport',
    },
    {
      type: 'toggle',
      label: 'Public Profile',
      desc: 'Allow others to see your badges and focus streak.',
      on: preferences.publicProfile === true,
      key: 'publicProfile',
    },
    {
      type: 'theme',
      label: 'App Theme',
      desc: `Currently using ${preferences.appTheme || 'system'} theme.`,
    },
  ];

  async function updatePreference(key, value) {
    const token = localStorage.getItem('token');
    const prevUser = JSON.parse(JSON.stringify(user));
    // optimistic update
    const updated = { ...user };
    updated.profiles = { ...updated.profiles, preferences: { ...preferences, [key]: value } };
    setUser(updated);
    try {
      setLoadingPref(true);
      const res = await fetch(`${baseUrl}/api/profile/preferences`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify({ preferences: { [key]: value } }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update preference');
      }
      // update localStorage and state with server response
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      stored.profiles = data.profiles;
      localStorage.setItem('user', JSON.stringify(stored));
      setUser(stored);
      toast.success('Preference updated');
    } catch (err) {
      console.error('Preference update failed', err);
      toast.error(err.message || 'Could not update preference');
      setUser(prevUser);
    } finally {
      setLoadingPref(false);
    }
  }

  function startEditing() {
    setEditFirstName(profile.firstName || '');
    setEditLastName(profile.lastName || '');
    setProfileError('');
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
    setProfileError('');
  }

  async function saveProfile(e) {
    e.preventDefault();
    setProfileError('');

    const firstName = editFirstName.trim();
    const lastName = editLastName.trim();

    if (!firstName || firstName.length < 3) {
      setProfileError('First name must be at least 3 characters.');
      return;
    }

    if (!lastName || lastName.length < 3) {
      setProfileError('Last name must be at least 3 characters.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setProfileError('You must be logged in to update your profile.');
      return;
    }

    const prevUser = JSON.parse(JSON.stringify(user));
    const optimisticUser = {
      ...user,
      profiles: { ...profile, firstName, lastName },
    };

    setUser(optimisticUser);

    try {
      setLoadingPref(true);
      const res = await fetch(`${baseUrl}/api/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName, lastName }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not update profile.');
      }

      const storedJson = localStorage.getItem('user') || localStorage.getItem('User') || '{}';
      const stored = JSON.parse(storedJson);
      stored.profiles = data.profiles || { ...profile, firstName, lastName };
      localStorage.setItem('user', JSON.stringify(stored));
      setUser(stored);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Profile update failed', err);
      setProfileError(err.message || 'Could not update profile.');
      setUser(prevUser);
      toast.error(err.message || 'Could not update profile');
    } finally {
      setLoadingPref(false);
    }
  }

  return (
    <section className={styles.profile}>
      {/* User header */}
      <header className={styles.userCard}>
        <img src={profile.profilePicture || avatar} alt="User profile" className={styles.avatar} />
        <div className={styles.userInfo}>
          {isEditing ? (
            <form className={styles.profileForm} onSubmit={saveProfile}>
              {profileError ? <p className={styles.profileError}>{profileError}</p> : null}
              <div className={styles.profileFormRow}>
                <label htmlFor="firstName">First name</label>
                <input
                  id="firstName"
                  type="text"
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                  className={styles.profileInput}
                />
              </div>
              <div className={styles.profileFormRow}>
                <label htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  type="text"
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                  className={styles.profileInput}
                />
              </div>
              <div className={styles.profileButtons}>
                <button type="submit" className={styles.editButton} disabled={loadingPref}>
                  Save
                </button>
                <button type="button" className={styles.cancelButton} onClick={cancelEditing}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h2 className={styles.userName}>{displayName}</h2>
              <p className={styles.userEmail}>
                <img src={iconEnvelope} alt="" className={styles.userEmailIcon} />
                <span>{userEmail}</span>
              </p>
              <p className={styles.userJoined}>Joined {joinedDate}</p>
            </>
          )}
        </div>
        <button
          type="button"
          className={styles.editButton}
          onClick={isEditing ? cancelEditing : startEditing}
          aria-label={isEditing ? 'Cancel profile edit' : 'Edit profile'}
        >
          <img src={iconEdit} alt="" className={styles.editIcon} />
          <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
        </button>
      </header>

      {/* Focus Statistics */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Focus Statistics</h3>
        <div className={styles.statsGrid}>
          {stats.map((stat) => (
            <article key={stat.label} className={styles.statCard}>
              <span className={styles.statLabel}>{stat.label}</span>
              <div className={styles.statValue}>
                <span className={styles.statNumber}>{stat.value}</span>
                {stat.unit && <span className={styles.statUnit}>{stat.unit}</span>}
              </div>
              <img
                src={stat.icon}
                alt=""
                className={`${styles.statIcon} ${stat.iconClass ? styles[stat.iconClass] : ''}`}
              />
            </article>
          ))}
        </div>
      </section>

      {/* Badges */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Badges &amp; Milestones</h3>
          <button type="button" className={styles.viewAll}>
            <span>View all</span>
            <img src={iconArrowRight} alt="" className={styles.viewAllIcon} />
          </button>
        </div>
        <div className={styles.badgesCard}>
          {badgesList.map((badge) => (
            <div
              key={badge.label}
              className={`${styles.badge} ${badge.state === 'locked' ? styles.badgeLocked : ''}`}
            >
              <div
                className={`${styles.badgeBubble} ${
                  badge.state === 'active'
                    ? styles.badgeBubbleActive
                    : badge.state === 'locked'
                    ? styles.badgeBubbleLocked
                    : ''
                }`}
              >
                <img src={badge.icon} alt="" />
              </div>
              <span
                className={`${styles.badgeLabel} ${
                  badge.state === 'locked' ? styles.badgeLabelLocked : ''
                }`}
              >
                {badge.label.split('\n').map((line, i) => (
                  <span key={i} style={{ display: 'block' }}>
                    {line}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Preferences */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Preferences</h3>
        <div className={styles.prefsCard}>
          {prefs.map((pref) => (
            <div key={pref.label} className={styles.prefRow}>
              <div>
                <p className={styles.prefLabel}>{pref.label}</p>
                <p className={styles.prefDesc}>{pref.desc}</p>
              </div>
              {pref.type === 'toggle' ? (
                <Toggle on={pref.on} onToggle={(val) => updatePreference(pref.key, val)} ariaLabel={pref.label} />
              ) : (
                <button type="button" className={styles.themeButton}>
                  <img src={iconMoon} alt="" className={styles.themeIcon} />
                  <span>Dark Mode</span>
                  <img src={iconChevronDown} alt="" className={styles.themeChevron} />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
