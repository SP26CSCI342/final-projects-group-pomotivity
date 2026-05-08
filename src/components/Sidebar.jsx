import { NavLink, useLocation } from 'react-router-dom';
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
  { to: '/login', label: 'Sign Out', icon: iconSignout },
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

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
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
        {footerNav.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </ul>
    </aside>
  );
}
