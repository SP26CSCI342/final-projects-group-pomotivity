import editIcon from '../../assets/icon-edit.svg';
import styles from './taskDetails.module.css';

function SmallTaskCard({ title, progress, timeSpent }) {
  const progressPercentage = progress || 0;

  return (
    <div className={styles.smallCard}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <button className={styles.iconBtn} type="button">
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
      </div>
      <p className={styles.timeSpent}>{timeSpent || 'Time Spent: 0h0m'}</p>
    </div>
  );
}

function LargeTaskCard({ title, progress, timeSpent, tasks }) {
  const progressPercentage = progress || 0;

  return (
    <div className={styles.largeCard}>
      <div className={styles.headerLarge}>
        <h3 className={styles.title}>{title}</h3>
        <button className={styles.iconBtn} type="button">
          <img src={editIcon} alt="Expand" />
        </button>
      </div>

      <div className={styles.statsRow}>
        <span className={styles.statLabel}>Tasks done {tasks.length}</span>
        <div className={styles.progressSection}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className={styles.percentage}>{progressPercentage}%</span>
        </div>
      </div>

      <div className={styles.taskList}>
        <h4 className={styles.tasksHeading}>Tasks</h4>
        {tasks.map((task, idx) => (
          <div key={idx} className={styles.taskItem}>
            <span className={styles.taskName}>{task.name}</span>
            <div className={styles.taskProgressBar}>
              <div
                className={styles.taskProgressFill}
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className={styles.timeSpentLarge}>{timeSpent || 'Time Spent: 0h0m'}</p>
    </div>
  );
}

export default function TaskDetails() {
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

  const largeProject = {
    id: 4,
    title: 'Project 2 4/8/27',
    progress: 80,
    timeSpent: 'Time Spent: 12h4m',
    tasks: [
      { name: 'Task 1', progress: 100 },
      { name: 'Task 2', progress: 60 },
      { name: 'Task 3', progress: 0 },
      { name: 'Task 4', progress: 60 },
      { name: 'Task 5', progress: 0 },
      { name: 'Task 6', progress: 0 },
      { name: 'Task 7', progress: 0 },
    ],
  };

  return (
    <div className={styles.tasksContainer}>
      <div className={styles.tasksHeader}>
        <h2 className={styles.tasksTitle}>All Tasks</h2>
        <button className={styles.tasksAvatarBtn} type="button">
          👤
        </button>
      </div>

      <div className={styles.bentogrid}>
        {/* Small task cards */}
        {smallTasks.map((task) => (
          <div key={task.id} className={styles.gridItemSmall}>
            <SmallTaskCard
              title={task.title}
              progress={task.progress}
              timeSpent={task.timeSpent}
            />
          </div>
        ))}

        {/* Large project card */}
        <div className={styles.gridItemMedium}>
          <LargeTaskCard
            title={largeProject.title}
            progress={largeProject.progress}
            timeSpent={largeProject.timeSpent}
            tasks={largeProject.tasks}
          />
        </div>
      </div>
    </div>
  );
}
