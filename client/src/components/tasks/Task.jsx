import editIcon from '../../assets/icon-edit.svg';
import styles from '../../pages/taskDetails/taskDetails.module.css';

import iconChevronDown from '../../assets/icon-chevron-down.svg';
import iconCheckDone from '../../assets/icon-check-done.svg';
import iconPlusThin from '../../assets/icon-plus-thin.svg';

import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';


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


export default function Task({ id, name, progress, timeSpent}) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const progressPercentage = progress || 0;

  const [goals, setGoals] = useState([])
  const [isEditing, setIsEditing] = useState(false)

  const navigate = useNavigate()
  const time = parseTime(timeSpent)

  const [newName, setNewName] = useState(name)
  const [taskGoals, setTaskGoals] = useState([])
  const [taskList, setTaskList] = useState([])

  
  const removeSelf = () => {
    const newList = taskList.filter(task => task.id != id)
    const token = localStorage.getItem('token');
    if (!token) return;
      fetch(`${baseUrl}/api/task`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
        body: JSON.stringify(newList)
    });
    setIsEditing(false)
  }

  const confirm = () => {
      const newList = taskList.map(task => (
        task.id == id ?
        {...task, name: newName, goals: taskGoals}
        :
        task
      ))
      const token = localStorage.getItem('token');
      if (!token) return;
        fetch(`${baseUrl}/api/task`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
          body: JSON.stringify(newList)
      });
    setIsEditing(false)
  }

  const [loaded, setLoaded] = useState(false)
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

  return (
 <div className={styles.smallCard}>
      {isEditing ? (
        <form onSubmit={(e) => {e.preventDefault(); confirm()} }>
          <div className={styles.header}>
            <h3 key={crypto.randomUUID()} className={styles.title}><input value={newName} onChange={(e) => setNewName(e.target.value)}/></h3>
            <button type='button' onClick={() => setIsEditing(false)}>Cancel</button>
            <button type="submit">Submit</button>
            <button type='button' onClick={() => setIsEditing(false)} className={styles.iconBtn} type="button">
              <h2 style={{color:'#a10724'}}>X</h2>
            </button>
          </div>
          {taskList.map(task => {
              if(task.id == id){
                return (
                <div key={task.id} style={{overflow: 'auto'}}>
                {taskGoals.map((goal, i) => (
                  <p key={goal.id}><input required={true} placeholder='goal...' value={goal.name} onChange={(e) => setTaskGoals(taskGoals.map(g => (
                    goal.id == g.id ?
                    {...g,name: e.target.value}
                    :
                    g
                  )))}/> {i > 0 ? <button type='button' onClick={() => setTaskGoals(taskGoals.filter(e => goal.id != e.id))}>X</button> : null}</p>
                ))}
                <button type='button' onClick={() => setTaskGoals([...taskGoals, {id: crypto.randomUUID(), name: '', completed: false}])}>+ Add Goal</button>
          </div>
                )
              }
})}
        </form>
      ) : (
        <div>
          <div className={styles.header}>
            <h3 onClick={() => navigate("/timer", {state: {currentTask: id, projectId: null}})} className={styles.title, styles.hoverable}>{name}</h3>
            <button onClick={() => setIsEditing(true)} className={styles.iconBtn} type="button">
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
          <p className={styles.timeSpent}>{`Time Spent: ${time}`}</p>
        </div>
      )}
    </div>
  );
}

