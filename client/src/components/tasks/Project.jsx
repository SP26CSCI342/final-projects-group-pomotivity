import editIcon from '../../assets/icon-edit.svg';
import styles from '../../pages/taskDetails/taskDetails.module.css';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function parseTime(time) {

  //Less than a minute ago
  if (time < 60) {
    return `${time}s`
  }
  //1-59 minutes
  else if(time >= 60 && time < 3600){
    return `${Math.floor(time/60)}min`
  }
  //1-23 hours
  else if(time >= 3600){
    return `${Math.floor(time/3600)}hr ${Math.floor((time % 3600)/60)}min`
  }
}

export default function Project({ id, name, progress, timeSpent, tasks }) {
  const progressPercentage = progress || 0;

  const navigate = useNavigate()
  const time = parseTime(timeSpent)

  return (
    <div className={styles.largeCard}>
      <div className={styles.headerLarge}>
        <h3 className={styles.title}>{name}</h3>
        <button className={styles.iconBtn} type="button">
          <img src={editIcon} alt="Expand" />
        </button>
      </div>

      <div className={styles.statsRow}>
        <span className={styles.statLabel}>Tasks done {tasks.filter(task => task.progress == 100).length}</span>
        <div className={styles.progressSection}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className={styles.percentage}>{progressPercentage}%</span>
        </div>
      </div>

      <div className={styles.taskList}>
        <h4 className={styles.tasksHeading}>Tasks</h4>
        {tasks.map((task, idx) => (
          <div key={idx} className={styles.taskItem}>
            <span onClick={() => navigate("/timer", {state: {currentTask: task.id, projectId: id}})} className={styles.taskName}>{task.name}</span>
            <div className={styles.taskProgressBar}>
              <div
                className={styles.taskProgressFill}
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className={styles.timeSpentLarge}>{timeSpent || 'Time Spent: 0h0m'}</p>
    </div>
  );
}