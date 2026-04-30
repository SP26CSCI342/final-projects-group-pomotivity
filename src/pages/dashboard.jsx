import iconNote from '../assets/icon-note.svg';
import iconPlay from '../assets/icon-play.svg';
import iconChevronLeft from '../assets/icon-chevron-left.svg';
import iconChevronRight from '../assets/icon-chevron-right.svg';
import iconCalMarker from '../assets/icon-cal-marker.svg';
import iconDots from '../assets/icon-dots.svg';
import iconPlayMini from '../assets/icon-play-mini.svg';
import iconInfo from '../assets/icon-info.svg';
import styles from './dashboard.module.css';

const calendarRows = [
  [
    { day: 31, muted: true },
    { day: 1 },
    { day: 2 },
    { day: 3 },
    { day: 4 },
    { day: 5 },
    { day: 6 },
  ],
  [
    { day: 7 },
    { day: 8 },
    { day: 9 },
    { day: 10 },
    { day: 11 },
    { day: 12 },
    { day: 13 },
  ],
  [
    { day: 14, active: true },
    { day: 15 },
    { day: null, marker: true },
    { day: 17 },
    { day: 18 },
    { day: 19 },
    { day: 20 },
  ],
];

const timelines = [
  { title: 'Project Alpha Launch', subtitle: 'In 2 days' },
  { title: 'Q3 Review Prep', subtitle: 'Next week' },
];

const tasks = [
  { name: 'Task 1', percent: 80 },
  { name: 'Task 2', percent: 60 },
  { name: 'Japanese Study', percent: 50 },
  { name: 'Task 4', percent: 10 },
];

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <section className={styles.center}>
        <header className={styles.header}>
          <p className={styles.date}>Thursday, May 14</p>
          <h2 className={styles.heading}>Good morning.</h2>
        </header>

        <article className={styles.article}>
          <div className={styles.articleHeader}>
            <img src={iconNote} alt="" className={styles.articleHeaderIcon} />
            <h3 className={styles.articleHeaderTitle}>Daily note</h3>
          </div>
          <div className={styles.articleBody}>
            <p className={styles.articleParagraph}>
              I like this note-taking app. Actually I am going to build my own
              note-taking app that solves the problems I find myself having, and
              maybe the issues others are having as well.
            </p>
            <p className={styles.articleParagraph}>
              Also, I might implement it inside the Pomotivity platform so people
              could manage time and take notes.
            </p>
            <p className={styles.articleParagraph}>
              First order of business: To get comfortable using Vim/Neovim.
            </p>
          </div>
        </article>

        <div className={styles.focusButtonWrap}>
          <button type="button" className={styles.focusButton}>
            <img src={iconPlay} alt="" className={styles.focusButtonIcon} />
            <span>Start Focus</span>
          </button>
        </div>
      </section>

      <aside className={styles.widgets}>
        <div className={styles.calWidget}>
          <div className={styles.calHeader}>
            <span className={styles.calMonth}>June 2026</span>
            <div className={styles.calNav}>
              <button type="button" className={styles.calNavButton} aria-label="Previous month">
                <img src={iconChevronLeft} alt="" className={styles.calChevron} />
              </button>
              <button type="button" className={styles.calNavButton} aria-label="Next month">
                <img src={iconChevronRight} alt="" className={styles.calChevron} />
              </button>
            </div>
          </div>
          <div className={styles.calGrid}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className={styles.calDow}>{d}</div>
            ))}
            {calendarRows.flat().map((cell, i) => {
              const cls = [styles.calDay];
              if (cell.muted) cls.push(styles.calDayMuted);
              if (cell.active) cls.push(styles.calDayActive);
              if (cell.marker) cls.push(styles.calDayMarker);
              return (
                <div key={i} className={cls.join(' ')}>
                  {cell.marker ? <img src={iconCalMarker} alt="" /> : cell.day}
                </div>
              );
            })}
          </div>
        </div>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h4 className={styles.sectionTitle}>Approaching Timelines</h4>
            <img src={iconDots} alt="" className={styles.dotsIcon} />
          </div>
          <ul className={styles.timelineList}>
            {timelines.map((t) => (
              <li key={t.title} className={styles.timelineCard}>
                <div className={styles.timelineLeft}>
                  <button type="button" className={styles.timelinePlay} aria-label={`Play ${t.title}`}>
                    <img src={iconPlayMini} alt="" className={styles.timelinePlayIcon} />
                  </button>
                  <div className={styles.timelineMeta}>
                    <span className={styles.timelineTitle}>{t.title}</span>
                    <span className={styles.timelineSubtitle}>{t.subtitle}</span>
                  </div>
                </div>
                <img src={iconInfo} alt="" className={styles.timelineInfo} />
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h4 className={styles.sectionTitle}>Tasks Progress</h4>
          </div>
          <ul className={styles.taskList}>
            {tasks.map((t) => (
              <li key={t.name} className={styles.taskRow}>
                <div className={styles.taskHead}>
                  <span className={styles.taskName}>{t.name}</span>
                  <span className={styles.taskPercent}>{t.percent}%</span>
                </div>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} style={{ width: `${t.percent}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </div>
  );
}
