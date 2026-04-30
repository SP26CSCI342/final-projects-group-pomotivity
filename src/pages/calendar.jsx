import iconChevronLeft from '../assets/icon-chevron-left-lg.svg';
import iconChevronRight from '../assets/icon-chevron-right-lg.svg';
import iconCalEvent1 from '../assets/icon-cal-event.svg';
import iconCalEvent2 from '../assets/icon-cal-event-2.svg';
import iconPlusSm from '../assets/icon-plus-sm.svg';
import styles from './calendar.module.css';

const days = [
  { day: 31, muted: true },
  { day: 1 },
  { day: 2 },
  { day: 3 },
  { day: 4 },
  { day: 5 },
  { day: 6 },
  { day: 7 },
  { day: 8 },
  { day: 9 },
  { day: 10 },
  { day: 11 },
  { day: 12 },
  { day: 13 },
  { day: 14, marker: iconCalEvent1 },
  {
    day: 15,
    highlight: true,
    events: [{ label: 'Project Alpha Launch', variant: 'green' }],
  },
  { day: 16, marker: iconCalEvent2 },
  { day: 17 },
  { day: 18 },
  { day: 19 },
  { day: 20 },
  { day: 21 },
  { day: 22 },
  { day: 23 },
  { day: 24 },
  { day: 25 },
  { day: 26 },
  { day: 27, events: [{ label: 'Q3 Review', variant: 'red' }] },
  { day: 28 },
  { day: 29 },
  { day: 30 },
  { day: 1, muted: true },
  { day: 2, muted: true },
  { day: 3, muted: true },
  { day: 4, muted: true },
];

export default function Calendar() {
  return (
    <section className={styles.calendar}>
      <p className={styles.date}>Thursday, May 14</p>

      <div className={styles.headerRow}>
        <h2 className={styles.heading}>June 2026</h2>
        <div className={styles.navButtons}>
          <button type="button" className={styles.navButton} aria-label="Previous month">
            <img src={iconChevronLeft} alt="" className={styles.navChevron} />
          </button>
          <button type="button" className={styles.navButton} aria-label="Next month">
            <img src={iconChevronRight} alt="" className={styles.navChevron} />
          </button>
        </div>
      </div>

      <div className={styles.gridFrame}>
        <div className={styles.dowHeader}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className={styles.dowCell}>{d}</div>
          ))}
        </div>
        <div className={styles.grid}>
          {days.map((cell, i) => {
            const cls = [styles.day];
            if (cell.muted) cls.push(styles.dayMuted);
            if (cell.highlight) cls.push(styles.dayHighlight);
            return (
              <div key={i} className={cls.join(' ')}>
                <span className={styles.dayNumber}>{cell.day}</span>
                {cell.marker && <img src={cell.marker} alt="" className={styles.dayMarker} />}
                {cell.events && (
                  <div className={styles.dayEvents}>
                    {cell.events.map((ev, j) => (
                      <span
                        key={j}
                        className={`${styles.eventChip} ${
                          ev.variant === 'red' ? styles.eventChipRed : styles.eventChipGreen
                        }`}
                      >
                        {ev.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.agenda}>
        <h3 className={styles.agendaDate}>June 15, 2026</h3>
        <div className={styles.agendaRow}>
          <div className={styles.agendaEvents}>
            <div className={styles.eventCard}>
              <span className={`${styles.eventBar} ${styles.eventBarGreen}`} />
              <div className={styles.eventMeta}>
                <span className={styles.eventTitle}>Project Alpha Launch</span>
                <span className={styles.eventTime}>09:00 AM - 11:30 AM</span>
              </div>
            </div>
            <div className={`${styles.eventCard} ${styles.eventCardMuted}`}>
              <span className={`${styles.eventBar} ${styles.eventBarGray}`} />
              <div className={styles.eventMeta}>
                <span className={styles.eventTitle}>Weekly Standup</span>
                <span className={styles.eventTime}>01:00 PM - 01:30 PM</span>
              </div>
            </div>
          </div>

          <div className={styles.quickAddWrap}>
            <form className={styles.quickAdd} onSubmit={(e) => e.preventDefault()}>
              <h4 className={styles.quickAddTitle}>Quick Add Event</h4>
              <div className={styles.quickAddRow}>
                <input
                  type="text"
                  className={styles.quickAddInput}
                  placeholder="Event title..."
                />
                <button type="submit" className={styles.quickAddButton} aria-label="Add event">
                  <img src={iconPlusSm} alt="" className={styles.quickAddButtonIcon} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
