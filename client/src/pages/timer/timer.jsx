import { useState, useEffect, useRef } from 'react';
import iconRewind from '../../assets/icon-timer-rewind.svg';
import iconPause from '../../assets/icon-timer-pause.svg';
import iconPlay from '../../assets/icon-play.svg';
import iconForward from '../../assets/icon-timer-forward.svg';
import iconChevronDown from '../../assets/icon-chevron-down.svg';
import iconCheckDone from '../../assets/icon-check-done.svg';
import iconPlusThin from '../../assets/icon-plus-thin.svg';
import styles from './timer.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// AI was used at a high level to discuss the math for this specific function
function arcPath(progress) {
  if (progress <= 0) return null;
  if (progress >= 1) return 'M 12,240 A 228,228 0 0,1 468,240';
  const angle = Math.PI * (1 - progress);
  const x = (240 + 228 * Math.cos(angle)).toFixed(2);
  const y = (240 - 228 * Math.sin(angle)).toFixed(2);
  return `M 12,240 A 228,228 0 0,1 ${x},${y}`;
}

export default function Timer() {
  
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const { state } = useLocation()
  const { currentTask, projectId } = state ? state : {}

  const [sessionMins, setSessionMins] = useState(25);
  const [breakMins, setBreakMins] = useState(5);
  const [phase, setPhase] = useState('work');
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [goals, setGoals] = useState([]);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalText, setNewGoalText] = useState('');
  const addInputRef = useRef(null);
  const nextGoalId = useRef(0);


  const [taskList, setTaskList] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [checkResult, setCheckResult] = useState([null])
  const navigate = useNavigate()
  


  const completeTask = () => {
    setTaskList(taskList.map(task => (
      currentTask == task.id ?
      {...task, completed: true}
      :
      task
    )))
    toast.success("You completed a task!")
    navigate("/task/1")
  }
  //Initializes the list of tasks
   useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) return;


      fetch(`${baseUrl}/api/task`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.foundTask.tasks)) {
            setTaskList(data.foundTask.tasks);
            setLoaded(true);
          }
        })
        .catch((error) => {
          console.error('Error loading tasks:', error);
        });
    }, []);

      //Sends the updated file tree to the database whenever new files are created
    useEffect(() => {
      if (loaded){
        const token = localStorage.getItem('token');
        if (!token) return;

        fetch(`${baseUrl}/api/task`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
          body: JSON.stringify(taskList)
        });
      }
    }, [taskList])

    const check = () => {
      taskList.map(task => {
        if(task.id == currentTask){
            setCheckResult(task.goals.filter(g => g.complete == false))
         }
        })
      }

    useEffect(() => {
      check(taskList)
    },[taskList])

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;
    const id = setTimeout(() => {
      if (secondsLeft === 1) {
        const nextPhase = phase === 'work' ? 'break' : 'work';
        const nextSecs = nextPhase === 'work' ? sessionMins * 60 : breakMins * 60;
        setPhase(nextPhase);
        setTotalSeconds(nextSecs);
        setSecondsLeft(nextSecs);
        setIsRunning(false);
      } else {
        setSecondsLeft(s => s - 1);
      }
    }, 1000);

    //Updates the task's time
    setTaskList(taskList.map(task => (
      task.id == currentTask ?
      {...task, time: task.time + 1}
      :
      task
    )))

    return () => clearTimeout(id);
  }, [isRunning, secondsLeft, phase, sessionMins, breakMins]);

  useEffect(() => {
    if (isAddingGoal) addInputRef.current?.focus();
  }, [isAddingGoal]);

  function handleRewind() {
    setSecondsLeft(totalSeconds);
    setIsRunning(false);
  }

  function handleForward() {
    const nextPhase = phase === 'work' ? 'break' : 'work';
    const nextSecs = nextPhase === 'work' ? sessionMins * 60 : breakMins * 60;
    setPhase(nextPhase);
    setTotalSeconds(nextSecs);
    setSecondsLeft(nextSecs);
    setIsRunning(false);
  }

  function handleSessionChange(e) {
    const mins = Number(e.target.value);
    setSessionMins(mins);
    if (phase === 'work') {
      setSecondsLeft(mins * 60);
      setTotalSeconds(mins * 60);
      setIsRunning(false);
    }
  }

  function handleBreakChange(e) {
    const mins = Number(e.target.value);
    setBreakMins(mins);
    if (phase === 'break') {
      setSecondsLeft(mins * 60);
      setTotalSeconds(mins * 60);
      setIsRunning(false);
    }
  }

  function toggleGoal(id) {
    setGoals(gs => gs.map(g => g.id === id ? { ...g, done: !g.done } : g));
  }

  function commitGoal() {
    const text = newGoalText.trim();
    if (text) {
      setGoals(gs => [...gs, { id: nextGoalId.current++, label: text, done: false }]);
    }
    setNewGoalText('');
    setIsAddingGoal(false);
  }

  const progress = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;
  const progressPath = arcPath(progress);
  const percent = Math.round(progress * 100);

  return (
    <section className={styles.timer}>
      <header className={styles.header}>
        <h2 className={styles.heading}>
          {phase === 'work' ? 'Deep Work Session' : 'Break Time'}
        </h2>
        <p className={styles.subheading}>
          {phase === 'work'
            ? "Stay focused, you've got this."
            : "Take a breather, you've earned it."}
        </p>
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
              {progressPath && (
                <path
                  d={progressPath}
                  stroke="#217731"
                  strokeWidth="24"
                  fill="none"
                  strokeLinecap="butt"
                />
              )}
            </svg>
            <div className={styles.arcCenter}>
              <span className={styles.arcTime}>{formatTime(secondsLeft)}</span>
              <span className={styles.arcPill}>{percent}% Complete</span>
            </div>
          </div>

          <div className={styles.controls}>
            <button type="button" className={styles.ctrl} aria-label="Rewind" onClick={handleRewind}>
              <img src={iconRewind} alt="" className={styles.ctrlIcon} />
            </button>
            <button
              type="button"
              className={`${styles.ctrl} ${styles.ctrlPlay}`}
              aria-label={isRunning ? 'Pause' : 'Play'}
              onClick={() => setIsRunning(r => !r)}
            >
              <img src={isRunning ? iconPause : iconPlay} alt="" className={styles.ctrlIcon} />
            </button>
            <button type="button" className={styles.ctrl} aria-label="Skip" onClick={handleForward}>
              <img src={iconForward} alt="" className={styles.ctrlIcon} />
            </button>
          </div>

          <div className={styles.cadence}>
            <span className={styles.cadenceLabel}>Take</span>
            <span className={styles.cadenceSelectWrap}>
              <select className={styles.cadenceSelect} value={breakMins} onChange={handleBreakChange}>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10">10</option>
              </select>
              <img src={iconChevronDown} alt="" className={styles.cadenceChevron} />
            </span>
            <span className={styles.cadenceLabel}>every</span>
            <span className={styles.cadenceSelectWrap}>
              <select className={styles.cadenceSelect} value={sessionMins} onChange={handleSessionChange}>
                <option value="15">15 mins</option>
                <option value="25">25 mins</option>
                <option value="50">50 mins</option>
              </select>
              <img src={iconChevronDown} alt="" className={styles.cadenceChevron} />
            </span>
          </div>

          <section className={styles.goals}>
            <header className={styles.goalsHeader}>
              <h2 style={{ position:'relative', justifySelf:'center', bottom: 10}}>{taskList.find(task => task.id == currentTask) ? taskList.find(task => task.id == currentTask).name : null}</h2>
              <h3 className={styles.goalsTitle}>Task Goals</h3>
            </header>
            <ul className={styles.goalList}>
                {taskList.map((task) => (
                  task.id == currentTask ?
                  task.goals.map(goal => (
                  <li key={goal.id} className={styles.goalItem}>
                    <button
                      type="button"
                      value={goal.complete}
                      className={styles.checkbox}
                      aria-pressed={goal.done}
                      aria-label={`Toggle ${goal.label}`}
                      onClick={(e) => setTaskList(taskList.map(t => (
                        t.id == currentTask ?
                        {...t, goals: t.goals.map(g => (
                          g.id == goal.id ?
                          {...g,complete: !g.complete}
                          :
                          g
                        ))}
                        :
                        t
                  )))}
                    >
                      {goal.complete && (
                        <img src={iconCheckDone} alt="" className={styles.checkboxIcon} />
                      )}
                    </button>
                    <span className={`${styles.goalLabel} ${goal.done ? styles.goalLabelDone : ''}`}>
                      {goal.name}
                    </span>
                  </li> ))
                  :
                  null
                ))}
              </ul>
              {checkResult.length == 0 && currentTask ? <button onClick={() => completeTask()}>Complete</button> : null}
           {!currentTask ?
           <>
            {goals.length > 0 && (
              <ul className={styles.goalList}>
                {goals.map(goal => (
                  <li key={goal.id} className={styles.goalItem}>
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
                    <span className={`${styles.goalLabel} ${goal.done ? styles.goalLabelDone : ''}`}>
                      {goal.label}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {isAddingGoal ? (
              <form
                className={styles.addGoalForm}
                onSubmit={e => { e.preventDefault(); commitGoal(); }}
              >
                <input
                  ref={addInputRef}
                  className={styles.addGoalInput}
                  value={newGoalText}
                  onChange={e => setNewGoalText(e.target.value)}
                  onBlur={commitGoal}
                  placeholder="Enter goal..."
                />
              </form>
            ) : (
              <button type="button" className={styles.addGoal} onClick={() => setIsAddingGoal(true)}>
                <img src={iconPlusThin} alt="" className={styles.addGoalIcon} />
                <span>Add Goal</span>
              </button>
            )}
            </>
            :
            null
          } 
            
          </section>
        </div>
      </div>
    </section>
  );
}
