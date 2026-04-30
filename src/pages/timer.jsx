import iconRewind from '../assets/icon-timer-rewind.svg';
import iconPause from '../assets/icon-timer-pause.svg';
import iconForward from '../assets/icon-timer-forward.svg';
import iconChevronDown from '../assets/icon-chevron-down.svg';
import iconCheckDone from '../assets/icon-check-done.svg';
import iconCheckEmpty from '../assets/icon-check-empty.svg';
import iconPlusThin from '../assets/icon-plus-thin.svg';
import styles from './timer.module.css';

const goals = [
  { label: 'Reread Textbook', done: true },
  { label: 'Worksheet pages 58-60', done: false },
  { label: 'Review kanji 125-140', done: false },
];

export default function Timer() {
  return (
    <section className={styles.timer}>
      <header className={styles.header}>
        <h2 className={styles.heading}>Deep Work Session</h2>
        <p className={styles.subheading}>Stay focused, you're halfway there.</p>
      </header>

      <div className={styles.body}>
        <div className={styles.timerStack}>
          <div className={styles.arcWrap}>
            <svg className={styles.arcSvg} viewBox="0 0 480 240">
              <path
                d="M 12,240 A 228,228 0 0,1 468,240"
                stroke="#342726"
                strokeWidth="24"
                fill="none"
                strokeLinecap="butt"
              />
              <path
                d="M 12,240 A 228,228 0 0,1 240,12"
                stroke="#217731"
                strokeWidth="24"
                fill="none"
                strokeLinecap="butt"
              />
            </svg>
            <div className={styles.arcCenter}>
              <span className={styles.arcTime}>12:30</span>
              <span className={styles.arcPill}>50% Complete</span>
            </div>
          </div>

          <div className={styles.controls}>
            <button type="button" className={styles.ctrl} aria-label="Rewind">
              <img src={iconRewind} alt="" className={styles.ctrlIcon} />
            </button>
            <button
              type="button"
              className={`${styles.ctrl} ${styles.ctrlPlay}`}
              aria-label="Pause"
            >
              <img src={iconPause} alt="" className={styles.ctrlIcon} />
            </button>
            <button type="button" className={styles.ctrl} aria-label="Forward">
              <img src={iconForward} alt="" className={styles.ctrlIcon} />
            </button>
          </div>

          <div className={styles.cadence}>
            <span className={styles.cadenceLabel}>Take</span>
            <span className={styles.cadenceSelectWrap}>
              <select className={styles.cadenceSelect} defaultValue="5">
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10">10</option>
              </select>
              <img src={iconChevronDown} alt="" className={styles.cadenceChevron} />
            </span>
            <span className={styles.cadenceLabel}>every</span>
            <span className={styles.cadenceSelectWrap}>
              <select className={styles.cadenceSelect} defaultValue="25">
                <option value="15">15 mins</option>
                <option value="25">25 mins</option>
                <option value="50">50 mins</option>
              </select>
              <img src={iconChevronDown} alt="" className={styles.cadenceChevron} />
            </span>
          </div>

          <section className={styles.goals}>
            <header className={styles.goalsHeader}>
              <h3 className={styles.goalsTitle}>Task Goals</h3>
            </header>
            <ul className={styles.goalList}>
              {goals.map((goal) => (
                <li key={goal.label} className={styles.goalItem}>
                  <button
                    type="button"
                    className={styles.checkbox}
                    aria-pressed={goal.done}
                    aria-label={`Toggle ${goal.label}`}
                  >
                    {goal.done && (
                      <img src={iconCheckDone} alt="" className={styles.checkboxIcon} />
                    )}
                    {!goal.done && (
                      <img
                        src={iconCheckEmpty}
                        alt=""
                        className={styles.checkboxIcon}
                        style={{ visibility: 'hidden' }}
                      />
                    )}
                  </button>
                  <span
                    className={`${styles.goalLabel} ${goal.done ? styles.goalLabelDone : ''}`}
                  >
                    {goal.label}
                  </span>
                </li>
              ))}
            </ul>
            <button type="button" className={styles.addGoal}>
              <img src={iconPlusThin} alt="" className={styles.addGoalIcon} />
              <span>Add Goal</span>
            </button>
          </section>
        </div>
      </div>
    </section>
  );
}
