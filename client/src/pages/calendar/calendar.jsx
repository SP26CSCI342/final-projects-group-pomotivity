import { useEffect, useMemo, useState } from 'react';
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

export default function Calendar() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(todayIso);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(todayIso);
  const [newVariant, setNewVariant] = useState('green');
  const [editingEventId, setEditingEventId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState(todayIso);
  const [editVariant, setEditVariant] = useState('green');
  const [editTime, setEditTime] = useState('All day');
  const [visibleMonth, setVisibleMonth] = useState(currentMonth);
  const [visibleYear, setVisibleYear] = useState(currentYear);

  const getEventId = (event) => event.id || event._id;

  const visibleDate = new Date(visibleYear, visibleMonth, 1);
  const monthLabel = visibleDate.toLocaleString('default', { month: 'long' });
  const displayYear = visibleDate.getFullYear();
  const startWeekday = visibleDate.getDay();
  const daysInMonth = new Date(visibleYear, visibleMonth + 1, 0).getDate();
  const totalCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`${baseUrl}/api/events`, {
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

  const selectedEvents = eventsByDate[selectedDate] || [];
  const [selectedYear, selectedMonth, selectedDay] = selectedDate.split('-').map(Number);
  const selectedLabel = new Date(selectedYear, selectedMonth - 1, selectedDay).toLocaleDateString('en-US', {
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
    const dateKey = formatDateKey(visibleYear, visibleMonth, day);
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

  const handleAddEvent = async (e) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token available.');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: newDate,
          title,
          variant: newVariant,
          time: 'All day',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Failed to create event:', data.error || data);
        return;
      }

      setEvents((currentEvents) => [...currentEvents, data.event]);
      setNewTitle('');
      setSelectedDate(newDate);
    } catch (error) {
      console.error('Error saving calendar event:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token available.');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('Failed to delete event:', data.error || data);
        return;
      }

      setEvents((currentEvents) =>
        currentEvents.filter(
          (event) => event.id !== eventId && event._id !== eventId,
        ),
      );
    } catch (error) {
      console.error('Error deleting calendar event:', error);
    }
  };

  const handleStartEditEvent = (event) => {
    const eventId = getEventId(event);
    setEditingEventId(eventId);
    setEditTitle(event.title || '');
    setEditDate(event.date || selectedDate);
    setEditVariant(event.variant || 'green');
    setEditTime(event.time || 'All day');
  };

  const handleCancelEdit = () => {
    setEditingEventId(null);
  };

  const handleUpdateEvent = async (eventId) => {
    if (!editTitle.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token available.');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/events/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          date: editDate,
          variant: editVariant,
          time: editTime,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Failed to update event:', data.error || data);
        return;
      }

      setEvents((currentEvents) =>
        currentEvents.map((event) => {
          const id = getEventId(event);
          if (id !== eventId) return event;
          return {
            ...event,
            title: data.event.title,
            date: data.event.date,
            variant: data.event.variant,
            time: data.event.time,
          };
        }),
      );
      setSelectedDate(editDate);
      setEditingEventId(null);
    } catch (error) {
      console.error('Error updating calendar event:', error);
    }
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
            onClick={() => {
              if (visibleMonth === 0) {
                setVisibleMonth(11);
                setVisibleYear((prev) => prev - 1);
              } else {
                setVisibleMonth((prev) => prev - 1);
              }
            }}
          >
            <img src={iconChevronLeft} alt="" className={styles.navChevron} />
          </button>
          <button
            type="button"
            className={styles.navButton}
            aria-label="Next month"
            onClick={() => {
              if (visibleMonth === 11) {
                setVisibleMonth(0);
                setVisibleYear((prev) => prev + 1);
              } else {
                setVisibleMonth((prev) => prev + 1);
              }
            }}
          >
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
                onClick={cell.empty ? undefined : () => {
                  setSelectedDate(cell.dateKey);
                  setNewDate(cell.dateKey);
                }}
                onKeyDown={cell.empty ? undefined : (event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    setSelectedDate(cell.dateKey);
                    setNewDate(cell.dateKey);
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
              selectedEvents.map((event, index) => {
                const eventId = getEventId(event);
                return (
                  <div key={eventId || index} className={styles.eventCard}>
                    <span
                      className={`${styles.eventBar} ${
                        event.variant === 'red' ? styles.eventBarRed : styles.eventBarGreen
                      }`}
                    />
                    {editingEventId === eventId ? (
                      <div className={styles.eventMeta}>
                        <input
                          type="text"
                          className={styles.editInput}
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                        <input
                          type="date"
                          className={styles.editInput}
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                        />
                        <select
                          className={styles.editInput}
                          value={editVariant}
                          onChange={(e) => setEditVariant(e.target.value)}
                        >
                          <option value="green">Green</option>
                          <option value="red">Red</option>
                        </select>
                        <input
                          type="text"
                          className={styles.editInput}
                          value={editTime}
                          onChange={(e) => setEditTime(e.target.value)}
                        />
                        <div className={styles.eventActionRow}>
                          <button
                            type="button"
                            className={styles.saveButton}
                            onClick={() => handleUpdateEvent(eventId)}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className={styles.eventMeta}>
                          <span className={styles.eventTitle}>{event.title}</span>
                          <span className={styles.eventTime}>{event.time || 'All day'}</span>
                        </div>
                        <div className={styles.eventActionGroup}>
                          <button
                            type="button"
                            className={styles.editButton}
                            onClick={() => handleStartEditEvent(event)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className={styles.deleteButton}
                            aria-label="Delete event"
                            onClick={() => handleDeleteEvent(eventId)}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
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
