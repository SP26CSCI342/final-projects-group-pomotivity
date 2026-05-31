import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import logoTomato from '../assets/logo-tomato.svg';
import iconDashboard from '../assets/nav-dashboard.svg';
import iconCalendar from '../assets/nav-calendar.svg';
import iconTimer from '../assets/nav-timer.svg';
import iconTasks from '../assets/nav-tasks.svg';
import iconNotes from '../assets/nav-notes.svg';
import iconProfile from '../assets/nav-profile.svg';
import iconPlus from '../assets/nav-plus.svg';
import iconSettings from '../assets/nav-settings.svg';
import iconSignout from '../assets/nav-signout.svg';
import styles from './Sidebar.module.css';
import { useState } from 'react';

const mainNav = [
  { to: '/', label: 'Dashboard', end: true, icon: iconDashboard },
  { to: '/calendar', label: 'Calendar', icon: iconCalendar },
  { to: '/timer', label: 'Timer', icon: iconTimer },
  { to: '/task/1', label: 'Tasks', icon: iconTasks, matchPrefix: '/task' },
  { to: '/notes', label: 'Notes', icon: iconNotes, matchPrefix: '/note' },
  { to: '/profile', label: 'Profile', icon: iconProfile },
];

const footerNav = [
  { to: '/settings', label: 'Settings', icon: iconSettings },
  { label: 'Sign Out', icon: iconSignout, action: 'signout' },
];

function NavItem({ to, end, label, icon, matchPrefix }) {
  const location = useLocation();
  const matchedByPrefix = matchPrefix && location.pathname.startsWith(matchPrefix);

  const className = ({ isActive }) => {
    const active = matchedByPrefix || isActive;
    return active ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;
  };

  return (
    <li>
      <NavLink to={to} end={end} className={className}>
        <img src={icon} alt="" className={styles.navIcon} />
        <span>{label}</span>
      </NavLink>
    </li>
  );
}

export default function Sidebar({show, setShow}) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('User');
    navigate('/login');
    setShow(false);
  };

  return (
    
    <>
    <aside className={`${styles.sidebar} ${show ? '' : styles.hidden}`}>
      <button onClick={() => setShow(false)} className={styles.hideButton}>Hide</button>
      
        <div className={styles.brand}>
          <span>P</span>
          <img src={logoTomato} alt="" className={styles.brandIcon} />
          <span>motivity</span>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {mainNav.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </ul>
        </nav>

        <button type="button" className={styles.cta}>
          <img src={iconPlus} alt="" className={styles.ctaIcon} />
          <span>New Note</span>
        </button>

        <ul className={styles.footer}>
          {footerNav.map((item) =>
            item.action === 'signout' ? (
              <li key={item.label}>
                <button type="button" onClick={handleSignOut} className={styles.navLink}>
                  <img src={item.icon} alt="" className={styles.navIcon} />
                  <span>{item.label}</span>
                </button>
              </li>
            ) : (
              <NavItem key={item.to} {...item} />
            )
          )}
        </ul>
      </aside>
      {!show && (
        <button onClick={() => setShow(true)} className={styles.showButton}>Show</button>
      )}
    </>
    
    
  );
  
}
