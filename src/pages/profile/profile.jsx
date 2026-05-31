import { useEffect, useState } from 'react';
import avatar from '../../assets/profile-avatar.png';
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

function Toggle({ on }) {
  return (
    <button
      type="button"
      className={`${styles.toggle} ${on ? styles.toggleOn : ''}`}
      aria-pressed={on}
      aria-label="Toggle setting"
    >
      <span className={styles.toggleKnob} />
    </button>
  );
}

export default function Profile() {
  const [user, setUser] = useState({ profiles: {} });

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
    },
    {
      type: 'toggle',
      label: 'Weekly Email Report',
      desc: 'Get a summary of your focus hours every Monday.',
      on: preferences.weeklyEmailReport !== false,
    },
    {
      type: 'toggle',
      label: 'Public Profile',
      desc: 'Allow others to see your badges and focus streak.',
      on: preferences.publicProfile === true,
    },
    {
      type: 'theme',
      label: 'App Theme',
      desc: `Currently using ${preferences.appTheme || 'system'} theme.`,
    },
  ];
  return (
    <section className={styles.profile}>
      {/* User header */}
      <header className={styles.userCard}>
        <img src={profile.profilePicture || avatar} alt="User profile" className={styles.avatar} />
        <div className={styles.userInfo}>
          <h2 className={styles.userName}>{displayName}</h2>
          <p className={styles.userEmail}>
            <img src={iconEnvelope} alt="" className={styles.userEmailIcon} />
            <span>{userEmail}</span>
          </p>
          <p className={styles.userJoined}>Joined {joinedDate}</p>
        </div>
        <button type="button" className={styles.editButton}>
          <img src={iconEdit} alt="" className={styles.editIcon} />
          <span>Edit Profile</span>
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
                <Toggle on={pref.on} />
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
