import editIcon from '../../assets/icon-edit.svg';
import styles from './taskDetails.module.css';

import Task from '../../components/tasks/Task';
import Project from '../../components/tasks/Project'
import { useEffect, useState } from 'react';


export default function TaskDetails() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const [taskList, setTaskList] = useState([])
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [isAddingProject, setIsAddingProject] = useState(false)

  const [newTaskName, setNewTaskName] = useState("")
  const [taskGoals, setTaskGoals] = useState([])
  const [projectTasks, setProjectTasks] = useState([])  
  const [loaded, setLoaded] = useState(false)

  //Initializes the task list. Creates it if the user doesn't have an entry in the database
   useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) return;

      fetch(`${baseUrl}/api/task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`}
      })
      .then(() =>
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
        })
      );
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
      }).then(
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
        })
      )
    }
  }, [taskList])



  const createTask = (id) => {
    setTaskList([...taskList, {id: id, name: newTaskName, goals: taskGoals, progress: 0, time: 0, type: 1, completed: false}])
  };

  const createProject = (id) => {
    setTaskList([...taskList, {id: id, name: newTaskName, tasks: projectTasks, progress: 0, time: 0, type: 2, completed: false}])
  };

  const removeTask = (id) => {
    setTaskList(taskList.filter(task => task.id != id))
  };

  const confirm = (type) => {
    if(type == 1){
      createTask(crypto.randomUUID())
      setIsAddingTask(false)
    }
    else{
      createProject(crypto.randomUUID())
      setIsAddingProject(false)
    }
  }

  // Sample task data matching the Figma design
  const smallTasks = [
    {
      id: 1,
      title: 'Task 1',
      progress: 80,
      timeSpent: 'Time Spent: 12h4m',
    },
    {
      id: 2,
      title: 'Task 1 3/4/26',
      progress: 80,
      timeSpent: 'Time Spent: 12h4m',
    },
    {
      id: 3,
      title: 'Task 2 7/3/26',
      progress: 80,
      timeSpent: 'Time Spent: 12h4m',
    },
  ];



  return (
    <div className={styles.tasksContainer}>
      <div className={styles.tasksHeader}>
        <h2 className={styles.tasksTitle}>All Tasks</h2>
        
       {/*} 
        <button className={styles.tasksAvatarBtn} type="button">
          👤
        </button> */}
      </div>
      <div style={{display:'flex', gap:'50px', position: 'relative', left: '50px',}}>
        {!isAddingTask && (
          <>
            <button onClick={() => {setIsAddingTask(true); setTaskGoals([{id: crypto.randomUUID(), name: '', completed: false}])}}>New Task</button>
            <button onClick={() => {setIsAddingProject(true); setProjectTasks([{id: crypto.randomUUID(), name: '', progress: 0, goals: [{id: crypto.randomUUID(), name: '', completed: false}]},{id: crypto.randomUUID(), name: '', progress: 0, goals: [{id: crypto.randomUUID(), name: '', completed: false}]}])}}>New Project</button>
          </>
        )}
      </div>

      <div className={styles.bentogrid}>

        {/*Adding a small task*/}
        {isAddingTask && (
          <div className={styles.smallCard}>
            <form onSubmit={(e) => {e.preventDefault(); confirm(1);} }>
              <div className={styles.header}>
                <h3><input required={true} placeholder="Task name..." value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)}/></h3>
                <button type='submit' style={{display: 'flex', flex: 1, gap: 1}}>Confirm</button>
                <button type='button' style={{display: 'flex', flex: 1, gap: 1}} onClick={() => setIsAddingTask(false)}>Cancel</button>

              </div>
              <div style={{overflow: 'auto'}}>
                {taskGoals.map((goal, i) => (
                  <p key={i}><input required={true} placeholder='goal...' value={goal.name} onChange={(e) => setTaskGoals(taskGoals.map(g => (
                    goal.id == g.id ?
                    {...g,name: e.target.value}
                    :
                    g
                  )))}/> {i > 0 ? <button type='button' onClick={() => setTaskGoals(taskGoals.filter(e => goal.id != e.id))}>X</button> : null}</p>
                ))}
                <button type='button' onClick={() => setTaskGoals([...taskGoals, {id: crypto.randomUUID(), name: '', completed: false}])}>+ Add Goal</button>
              </div>
            </form>
          </div>
        )}

        {/*Displaying small tasks*/}
        {taskList.map((task) => (
            task.type == 1 ?
            <div key={task.id} className={styles.gridItemSmall}>
              <Task
                id={task.id}
                name={task.name}
                progress={Math.round(task.goals.filter(g => g.complete).length/task.goals.length * 100)}
                timeSpent={task.time}
              />
            </div>
            :
            <div key={task.id} className={styles.gridItemMedium}>
              <Project
                id={task.id}
                name={task.name}
                progress={task.progress}
                timeSpent={task.time}
                tasks={task.tasks}
              />
            </div>
          ))}
        
        {/*Adding a projet*/}
        {isAddingProject && (
          <div className={styles.gridItemMedium}>
            <div className={styles.largeCard}>
              <form onSubmit={(e) => {e.preventDefault(); confirm(2);} }>
                <div className={styles.header}>
                  <h3><input required={true} placeholder="Project name..." value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)}/></h3>
                  <button type='submit' style={{display: 'flex', flex: 1, gap: 1}}>Confirm</button>
                  <button type='button' style={{display: 'flex', flex: 1, gap: 1}} onClick={() => setIsAddingProject(false)}>Cancel</button>

                </div>
                <div >
                  {projectTasks.map((task, i) => (
                    <div key={task.id}><input required={true} placeholder='task...' onChange={(e) => setProjectTasks(projectTasks.map(t => (
                      t.id == task.id ?
                      {...t,name: e.target.value}
                      :
                      t
                    )))}/>
                    {i > 1 ? <button type='button' onClick={() => setProjectTasks(projectTasks.filter(e => task.id != e.id))}>X</button> : null}
                    {task.goals.map((goal, j) => (
                      <p key={`${task.id}, ${goal.id}`} style={{position: 'relative', left:30, width:'50%'}}><input required={true} placeholder='goal...' value={goal.name} onChange={(e) => setProjectTasks(projectTasks.map(t => (
                      t.id == task.id ?
                      {...t, goals: t.goals.map(g => (
                        goal.id == g.id ?
                        {...g,name: e.target.value}
                        :
                        g))
                      }
                      :
                      t                      
                    ))
                    )}/> 
                    {j > 0 ? <button type='button' onClick={() => setProjectTasks(projectTasks.map(e => (
                        task.id == e.id ?
                        {...e,goals: e.goals.filter(g => g.id != goal.id)}
                        :
                        e)))}>X</button> : null}</p>
                    ))}
                    <button style={{position: 'relative', left:30}} type='button' onClick={() => setProjectTasks(projectTasks.map(e => (
                      task.id == e.id ?
                      {...e,goals: [...e.goals, {id: crypto.randomUUID(), name: '', completed: false} ]}
                      :
                      e
                    )))}>+ Add Goal</button>
                    </div>
                  ))}
                  <button type='button' onClick={() => setProjectTasks([...projectTasks, {id: crypto.randomUUID(), name: '', progress: 0, goals: [{id: crypto.randomUUID(), name: '', completed: false}]}])}>+ Add Task</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
