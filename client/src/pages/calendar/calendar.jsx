import { useMemo, useState } from 'react';
import iconChevronLeft from '../../assets/icon-chevron-left-lg.svg';
import iconChevronRight from '../../assets/icon-chevron-right-lg.svg';
import iconCalEvent1 from '../../assets/icon-cal-event.svg';
import iconCalEvent2 from '../../assets/icon-cal-event-2.svg';
import iconPlusSm from '../../assets/icon-plus-sm.svg';
import styles from './calendar.module.css';

const now = new Date();
const currentDay = now.getDate();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();
const monthLabel = now.toLocaleString('default', { month: 'long' });
const currentDateLabel = now.toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});

const formatDateKey = (year, month, day) =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const todayIso = formatDateKey(currentYear, currentMonth, currentDay);

const initialEvents = [
  {
    date: formatDateKey(currentYear, currentMonth, 14),
    title: 'test event 1'
  },
  {
    date: formatDateKey(currentYear, currentMonth, 15),
    title: 'Project Alpha Launch',
    variant: 'green',
    time: '09:00 AM - 11:30 AM',
  },
  {
    date: formatDateKey(currentYear, currentMonth, 16),
    title: 'test event 2'
  },
  {
    date: formatDateKey(currentYear, currentMonth, 27),
    title: 'Q3 Review',
    variant: 'red',
    time: '01:00 PM - 01:30 PM',
  },
];

const startWeekday = new Date(currentYear, currentMonth, 1).getDay();
const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
const totalCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7;

export default function Calendar() {
  const [events, setEvents] = useState(initialEvents);
  const [selectedDate, setSelectedDate] = useState(todayIso);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(todayIso);
  const [newVariant, setNewVariant] = useState('green');

  const eventsByDate = useMemo(
    () =>
      events.reduce((acc, event) => {
        acc[event.date] = acc[event.date] || [];
        acc[event.date].push(event);
        return acc;
      }, {}),
    [events],
  );

  const selectedEvents = eventsByDate[selectedDate] || [];
  const selectedLabel = new Date(selectedDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const days = [];

  for (let i = 0; i < startWeekday; i += 1) {
    days.push({ empty: true });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dateKey = formatDateKey(currentYear, currentMonth, day);
    const dayEvents = eventsByDate[dateKey] || [];
    const markerEvent = dayEvents.find((ev) => ev.marker);

    days.push({
      day,
      dateKey,
      events: dayEvents.filter((ev) => !ev.marker),
      marker: markerEvent?.marker,
      highlight: day === currentDay,
      selected: dateKey === selectedDate,
    });
  }

  while (days.length < totalCells) {
    days.push({ empty: true });
  }

  const handleAddEvent = (e) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;

    setEvents((currentEvents) => [
      ...currentEvents,
      {
        date: newDate,
        title,
        variant: newVariant,
        time: 'All day',
      },
    ]);
    setNewTitle('');
    setSelectedDate(newDate);
  };

  return (
    <section className={styles.calendar}>
      <p className={styles.date}>{currentDateLabel}</p>

      <div className={styles.headerRow}>
        <h2 className={styles.heading}>{`${monthLabel} ${currentYear}`}</h2>
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
            <div key={d} className={styles.dowCell}>
              {d}
            </div>
          ))}
        </div>
        <div className={styles.grid}>
          {days.map((cell, i) => {
            const cls = [styles.day];
            if (cell.empty) cls.push(styles.dayEmpty);
            if (cell.highlight) cls.push(styles.dayHighlight);
            if (cell.selected) cls.push(styles.daySelected);

            return (
              <div
                key={i}
                className={cls.join(' ')}
                role={cell.empty ? undefined : 'button'}
                tabIndex={cell.empty ? undefined : 0}
                onClick={cell.empty ? undefined : () => setSelectedDate(cell.dateKey)}
                onKeyDown={cell.empty ? undefined : (event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    setSelectedDate(cell.dateKey);
                  }
                }}
              >
                {!cell.empty && (
                  <>
                    <span className={styles.dayNumber}>{cell.day}</span>
                    {cell.marker && (
                      <img src={cell.marker} alt="Event marker" className={styles.dayMarker} />
                    )}
                    {cell.events && cell.events.length > 0 && (
                      <div className={styles.dayEvents}>
                        {cell.events.map((ev, j) => (
                          <span
                            key={j}
                            className={`${styles.eventChip} ${
                              ev.variant === 'red' ? styles.eventChipRed : styles.eventChipGreen
                            }`}
                          >
                            {ev.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.agenda}>
        <h3 className={styles.agendaDate}>{selectedLabel}</h3>
        <div className={styles.agendaRow}>
          <div className={styles.agendaEvents}>
            {selectedEvents.length > 0 ? (
              selectedEvents.map((event, index) => (
                <div key={index} className={styles.eventCard}>
                  <span
                    className={`${styles.eventBar} ${
                      event.variant === 'red' ? styles.eventBarRed : styles.eventBarGreen
                    }`}
                  />
                  <div className={styles.eventMeta}>
                    <span className={styles.eventTitle}>{event.title}</span>
                    <span className={styles.eventTime}>{event.time || 'All day'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.eventCardMuted}>
                <div className={styles.eventMeta}>
                  <span className={styles.eventTitle}>No events</span>
                  <span className={styles.eventTime}>Add an event below.</span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.quickAddWrap}>
            <form className={styles.quickAdd} onSubmit={handleAddEvent}>
              <h4 className={styles.quickAddTitle}>Quick Add Event</h4>
              <div className={styles.quickAddRow}>
                <input
                  type="text"
                  className={styles.quickAddInput}
                  placeholder="Event title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <button type="submit" className={styles.quickAddButton} aria-label="Add event">
                  <img src={iconPlusSm} alt="" className={styles.quickAddButtonIcon} />
                </button>
              </div>
              <div className={styles.quickAddRow}>
                <label className={styles.quickAddLabel} htmlFor="eventDate">
                  Date
                </label>
                <input
                  id="eventDate"
                  type="date"
                  className={styles.quickAddInput}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>
              <div className={styles.quickAddRow}>
                <label className={styles.quickAddLabel} htmlFor="eventVariant">
                  Color
                </label>
                <select
                  id="eventVariant"
                  className={styles.quickAddInput}
                  value={newVariant}
                  onChange={(e) => setNewVariant(e.target.value)}
                >
                  <option value="green">Green</option>
                  <option value="red">Red</option>
                </select>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
