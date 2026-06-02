import { useEffect, useMemo, useState } from 'react';
import CalendarLib from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import iconPlusSm from '../../assets/icon-plus-sm.svg';
import styles from './calendar.module.css';

const now = new Date();
const currentDateLabel = now.toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});

const formatDateKey = (year, month, day) =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const todayIso = formatDateKey(now.getFullYear(), now.getMonth(), now.getDate());

function makeDateKey(date) {
  return formatDateKey(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(todayIso);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(todayIso);
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [newVariant, setNewVariant] = useState('green');
  const [formError, setFormError] = useState('');
  const [viewDate, setViewDate] = useState(new Date());

  const monthLabel = viewDate.toLocaleString('default', { month: 'long' });
  const displayYear = viewDate.getFullYear();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('/api/events', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.events)) {
          setEvents(data.events);
        }
      })
      .catch((error) => {
        console.error('Error loading calendar events:', error);
      });
  }, []);

  const eventsByDate = useMemo(
    () =>
      events.reduce((acc, event) => {
        acc[event.date] = acc[event.date] || [];
        acc[event.date].push(event);
        return acc;
      }, {}),
    [events],
  );

  const selectedEvents = useMemo(() => {
    const dayEvents = eventsByDate[selectedDate] || [];
    return [...dayEvents].sort((a, b) => {
      if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime);
      if (a.startTime) return -1;
      if (b.startTime) return 1;
      return a.title.localeCompare(b.title);
    });
  }, [eventsByDate, selectedDate]);

  const [selectedYear, selectedMonth, selectedDay] = selectedDate.split('-').map(Number);
  const selectedLabel = new Date(selectedYear, selectedMonth - 1, selectedDay).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleDateChange = (date) => {
    const dateKey = makeDateKey(date);
    setSelectedDate(dateKey);
    setNewDate(dateKey);
    setViewDate(date);
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;

    if (newStartTime && newEndTime && newEndTime < newStartTime) {
      setFormError('End time must be after start time.');
      return;
    }

    setFormError('');
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token available.');
      return;
    }

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: newDate,
          title,
          variant: newVariant,
          startTime: newStartTime,
          endTime: newEndTime,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Failed to create event:', data.error || data);
        return;
      }

      setEvents((currentEvents) => [...currentEvents, data.event]);
      setNewTitle('');
      setNewStartTime('');
      setNewEndTime('');
      setSelectedDate(newDate);
    } catch (error) {
      console.error('Error saving calendar event:', error);
    }
  };

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;

    const dateKey = makeDateKey(date);
    const dayEvents = eventsByDate[dateKey] || [];
    if (dayEvents.length === 0) return null;

    return (
      <div className={styles.tileEvents}>
        {dayEvents.slice(0, 2).map((event, index) => (
          <span
            key={index}
            className={`${styles.eventChip} ${
              event.variant === 'red' ? styles.eventChipRed : styles.eventChipGreen
            }`}
          >
            {event.title}
          </span>
        ))}
      </div>
    );
  };

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return '';
    const dateKey = makeDateKey(date);
    return [
      dateKey === todayIso ? styles.todayTile : '',
      dateKey === selectedDate ? styles.selectedTile : '',
      eventsByDate[dateKey]?.length ? styles.hasEventTile : '',
    ]
      .filter(Boolean)
      .join(' ');
  };

  return (
    <section className={styles.calendar}>
      <p className={styles.date}>{currentDateLabel}</p>

      <div className={styles.headerRow}>
        <h2 className={styles.heading}>{`${monthLabel} ${displayYear}`}</h2>

        <div className={styles.navButtons}>
          <button
            type="button"
            className={styles.navButton}
            aria-label="Previous month"
            onClick={() => setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
          >
            <span className={styles.navChevron}>&lt;</span>
          </button>
          <button
            type="button"
            className={styles.navButton}
            aria-label="Next month"
            onClick={() => setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
          >
            <span className={styles.navChevron}>&gt;</span>
          </button>
        </div>
      </div>

      <div className={styles.calendarWrapper}>
        <CalendarLib
          onChange={handleDateChange}
          value={parseDateKey(selectedDate)}
          activeStartDate={viewDate}
          onActiveStartDateChange={({ activeStartDate }) => setViewDate(activeStartDate)}
          showNavigation={false}
          calendarType="gregory"
          tileContent={tileContent}
          tileClassName={tileClassName}
          className={styles.calendarLib}
        />
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
                    <span className={styles.eventTime}>
                      {event.startTime && event.endTime
                        ? `${event.startTime} - ${event.endTime}`
                        : event.startTime || event.endTime || event.time || 'All day'}
                    </span>
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
              {formError ? (
                <p style={{ color: '#d32f2f', marginBottom: '0.75rem' }}>{formError}</p>
              ) : null}
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
                <label className={styles.quickAddLabel} htmlFor="eventStartTime">
                  Start
                </label>
                <input
                  id="eventStartTime"
                  type="time"
                  className={styles.quickAddInput}
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                />
              </div>
              <div className={styles.quickAddRow}>
                <label className={styles.quickAddLabel} htmlFor="eventEndTime">
                  End
                </label>
                <input
                  id="eventEndTime"
                  type="time"
                  className={styles.quickAddInput}
                  value={newEndTime}
                  onChange={(e) => setNewEndTime(e.target.value)}
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
