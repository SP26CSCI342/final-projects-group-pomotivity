import { NavLink } from 'react-router-dom';
import logoTomato from '../assets/logo-tomato.svg';
import iconDashboard from '../assets/icon-nav-dashboard.svg';
import iconCalendar from '../assets/icon-nav-calendar.svg';
import iconTimelines from '../assets/icon-nav-timelines.svg';
import iconTasks from '../assets/icon-nav-tasks.svg';
import iconPlus from '../assets/icon-plus.svg';
import iconSettings from '../assets/icon-settings.svg';
import iconSignout from '../assets/icon-signout.svg';
import styles from './Sidebar.module.css';

const mainNav = [
  { to: '/', label: 'Dashboard', end: true, icon: iconDashboard, iconClass: 'navIconDashboard' },
  { to: '/calendar', label: 'Calendar', icon: iconCalendar, iconClass: 'navIconCalendar' },
  { to: '/timer', label: 'Timelines', icon: iconTimelines, iconClass: 'navIconTimelines' },
  { to: '/notes', label: 'Tasks', icon: iconTasks, iconClass: 'navIconTasks' },
];

const footerNav = [
  { to: '/settings', label: 'Settings', icon: iconSettings, iconClass: 'navIconSettings' },
  { to: '/login', label: 'Sign Out', icon: iconSignout, iconClass: 'navIconSignout' },
];

function NavItem({ to, end, label, icon, iconClass }) {
  return (
    <li>
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
        }
      >
        <img src={icon} alt="" className={`${styles.navIcon} ${styles[iconClass]}`} />
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
        <span>New Entry</span>
      </button>

      <ul className={styles.footer}>
        {footerNav.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </ul>
    </aside>
  );
}
