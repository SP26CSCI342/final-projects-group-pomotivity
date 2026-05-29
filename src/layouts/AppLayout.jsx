import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import styles from './AppLayout.module.css';
import { useState } from 'react';

export default function AppLayout() {

  const [sidebar, setSidebar] = useState(true)
  
  return (
    <div className={sidebar ? styles.container : styles.containerNoSidebar}>
      <Sidebar show={sidebar} setShow={setSidebar}/>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
