import iconFolderPlus from '../../assets/icon-folder-plus.svg';
import iconFolderMinus from '../../assets/icon-folder-minus.svg';
import iconFile from '../../assets/icon-file.svg';
import iconFilePlus from '../../assets/icon-file-plus.svg';
import iconClock from '../../assets/icon-clock-sm.svg';
import styles from '../../pages/notes/notes.module.css';

import File from './File';

import { useEffect, useState } from 'react';

function timeAgo(timestamp) {

  //Gets the time difference in seconds
  const timeDiff = Math.floor((Date.now() - timestamp)/1000)
  //Less than a minute ago
  if (timeDiff < 60) {
    return "less than a minute ago"
  }
  //1-59 minutes
  else if(timeDiff >= 60 && timeDiff < 3600){
    return `${Math.floor(timeDiff/60)}min ago`
  }
  //1-23 hours
  else if(timeDiff >= 3600 && timeDiff < 86400){
    return `${Math.floor(timeDiff/3600)}hr ${Math.floor((timeDiff % 3600)/60)}min ago`
  }
  //Days
  else if(timeDiff >= 86400){
    return `${Math.floor(timeDiff/86400)} day${Math.floor(timeDiff/86400) < 2 ? '' : 's'} ago`
  }
}

export default function Note({title, cardTitle, body, timestamp, onChange, id, progress}) {

    const [goalCompletion, setGoalCompletion] = useState(0)

    const[newTitle, setNewTitle] = useState(cardTitle)
    const[newBody, setNewBody] = useState(body)
    const[newProgess, setNewProgress] = useState(progress)
    const [seconds, setSeconds] = useState(0)

    //Changes the lastEdited value every minute
    useEffect(() => {
      const interval = setInterval(() => {
        setSeconds(prev => prev + 1)
      }, 60000);

      timeAgo(timestamp)
      return () => clearInterval(interval)
    }, [])
    


    return (
        <div className={styles.content}>
                <header className={styles.headerRow}>
                  <div className={styles.headerMeta}>
                    <h2 className={styles.heading}>{title}</h2>
                    <div className={styles.subhead}>
                      <img src={iconClock} alt="" className={styles.subheadIcon} />
                      <span className={styles.subheadText}>Last edited: {timeAgo(timestamp)}</span>
                    </div>
                  </div>
        
                  <div className={styles.progressCard}>
                    <div>
                      <p className={styles.progressLabel}>Goal Progress</p>
                      <div className={styles.progressTrack}>
                        <div className={styles.progressFill} style={{ width: `${newProgess}%` }} />
                      </div>
                    </div>
                    <span className={styles.progressPercent} style={{display: 'flex', alignItems: 'center'}}><input style={{width:60}} value={newProgess} type='number' max={100} min={0} defaultValue={0} onChange={(e) => setNewProgress(e.target.value)}/>%</span>
                  </div>
                </header>
        
                <article className={styles.card}>
                  <header className={styles.cardHeader}>
                    <h3 className={styles.cardTitle} style={{width: '100%'}}>
                        <textarea style={{fieldSizing: 'content', resize:'none', width: '100%', minWidth: '250x', height: 'auto'}} placeholder='Insert Title Here' value={newTitle} onChange={(e) => setNewTitle(e.target.value)}/></h3>
                  </header>
                  <p className={styles.japaneseText}>
                    <textarea style={{fieldSizing: 'content', resize:'none', width: '100%', minWidth: '250x', height: 'auto'}} placeholder='Insert Body Here' value={newBody} onChange={(e) => setNewBody(e.target.value)}/>
                  </p>
                </article>
        <button onClick={() => onChange(id, {cardTitle: newTitle, body: newBody, timestamp: Date.now(), progress: newProgess})}>Save</button>
              </div>
    )
}