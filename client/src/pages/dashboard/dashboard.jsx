import { useMemo, useState, useEffect } from 'react';
import iconNote from '../../assets/icon-note.svg';
import iconPlay from '../../assets/icon-play.svg';
import iconChevronLeft from '../../assets/icon-chevron-left.svg';
import iconChevronRight from '../../assets/icon-chevron-right.svg';
import iconCalMarker from '../../assets/icon-cal-marker.svg';
import iconDots from '../../assets/icon-dots.svg';
import iconPlayMini from '../../assets/icon-play-mini.svg';
import iconInfo from '../../assets/icon-info.svg';
import styles from './dashboard.module.css';

const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addMonths(date, offset) {
  return new Date(date.getFullYear(), date.getMonth() + offset, 1);
}

function formatMonthYear(date) {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function formatDateKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildCalendarDays(currentMonth) {
  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const daysInMonth = end.getDate();
  const prevMonthLastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate();
  const startWeekday = start.getDay();
  const totalCells = 42;

  return Array.from({ length: totalCells }, (_, index) => {
    const dayIndex = index - startWeekday;
    let date;
    let muted = false;

    if (dayIndex < 0) {
      date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        prevMonthLastDay + dayIndex + 1,
      );
      muted = true;
    } else if (dayIndex >= daysInMonth) {
      date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        dayIndex - daysInMonth + 1,
      );
      muted = true;
    } else {
      date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayIndex + 1);
    }

    return { date, day: date.getDate(), muted };
  });
}

function createEventMap(currentMonth) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  return {
    [formatDateKey(new Date(year, month, 14))]: true,
    [formatDateKey(new Date(year, month, 16))]: true,
    [formatDateKey(new Date(year, month, 27))]: true,
  };
}

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

function TaskProgress({t}){
  return(
  <li key={t.name} className={styles.taskRow}>
                <div className={styles.taskHead}>
                  <span className={styles.taskName}>{t.name}</span>
                  <span className={styles.taskPercent}>{t.goals.filter(g => g.complete).length/t.goals.length * 100}%</span>
                </div>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} style={{ width: `${t.goals.filter(g => g.complete).length/t.goals.length * 100}%` }} />
                </div>
              </li>
  )
}

export default function Dashboard() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(today));
  const [selectedDate, setSelectedDate] = useState(today);
  const eventsByDate = useMemo(() => createEventMap(currentMonth), [currentMonth]);
  const days = useMemo(() => buildCalendarDays(currentMonth), [currentMonth]);

  const [taskList, setTaskList] = useState([])
  

  const handleChangeMonth = (offset) => {
    const nextMonth = addMonths(currentMonth, offset);
    setCurrentMonth(nextMonth);

    const nextMonthEnd = endOfMonth(nextMonth).getDate();
    const adjustedDay = Math.min(selectedDate.getDate(), nextMonthEnd);
    setSelectedDate(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), adjustedDay));
  };

  const handleSelectDate = (date) => {
    if (
      date.getFullYear() !== currentMonth.getFullYear() ||
      date.getMonth() !== currentMonth.getMonth()
    ) {
      setCurrentMonth(startOfMonth(date));
    }
    setSelectedDate(date);
  };

  //Initializes the task list
   useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) return;
      fetch('/api/task', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.foundTask.tasks)) {
            setTaskList(data.foundTask.tasks);
          }
        })
        .catch((error) => {
          console.error('Error loading tasks:', error);
        }
      )}, []);

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
            <span className={styles.calMonth}>{formatMonthYear(currentMonth)}</span>
            <div className={styles.calNav}>
              <button
                type="button"
                className={styles.calNavButton}
                aria-label="Previous month"
                onClick={() => handleChangeMonth(-1)}
              >
                <img src={iconChevronLeft} alt="" className={styles.calChevron} />
              </button>
              <button
                type="button"
                className={styles.calNavButton}
                aria-label="Next month"
                onClick={() => handleChangeMonth(1)}
              >
                <img src={iconChevronRight} alt="" className={styles.calChevron} />
              </button>
            </div>
          </div>
          <div className={styles.calGrid}>
            {weekdays.map((d, i) => (
              <div key={i} className={styles.calDow}>{d}</div>
            ))}
            {days.map((cell, i) => {
              const cls = [styles.calDay];
              if (cell.muted) cls.push(styles.calDayMuted);
              if (isSameDay(cell.date, selectedDate)) cls.push(styles.calDayActive);
              const dateKey = formatDateKey(cell.date);
              const hasEvent = !!eventsByDate[dateKey];
              if (hasEvent) cls.push(styles.calDayMarker);

              return (
                <div
                  key={i}
                  className={cls.join(' ')}
                  onClick={() => handleSelectDate(cell.date)}
                >
                  {hasEvent ? <img src={iconCalMarker} alt="Event marker" /> : cell.day}
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
            {taskList.length > 0 ? taskList.map((t) => (
              t.type == 2 ?
              t.tasks.map(task => (
                <span>
                <TaskProgress t={task}/>
                <a style={{fontSize:12}}>from {t.name}</a>
                </span>
              ))
              
              :
              <TaskProgress t={t}/>
            ))
          : null}
          </ul>
        </section>
      </aside>
    </div>
  );
}