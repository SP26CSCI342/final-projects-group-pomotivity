import editIcon from '../../assets/icon-edit.svg';
import styles from '../../pages/taskDetails/taskDetails.module.css';

import iconChevronDown from '../../assets/icon-chevron-down.svg';
import iconCheckDone from '../../assets/icon-check-done.svg';
import iconPlusThin from '../../assets/icon-plus-thin.svg';

import { useState, useEffect } from "react";



function ProgressCheck(goal) {
    return (
        <button
          type="button"
          className={styles.checkbox}
          aria-pressed={goal.done}
          aria-label={`Toggle ${goal.label}`}
          onClick={() => toggleGoal(goal.id)}
        >
        {goal.done && (
            <img src={iconCheckDone} alt="" className={styles.checkboxIcon} />
      )}
        </button>
    )
}


export default function Task({ title, progress, timeSpent}) {
  const progressPercentage = progress || 0;

  const [goals, setGoals] = useState([])
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className={styles.smallCard}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <button className={styles.iconBtn} type="button">
          <img src={editIcon} alt="Edit" />
        </button>
      </div>
      <div className={styles.progressSection}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span className={styles.percentage}>{progressPercentage}%</span>
        {/*<ProgressCheck/>*/}
      </div>
      <p className={styles.timeSpent}>{timeSpent || 'Time Spent: 0h0m'}</p>
    </div>
  );
}

