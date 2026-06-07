import iconFolderPlus from '../../assets/icon-folder-plus.svg';
import iconFolderMinus from '../../assets/icon-folder-minus.svg';
import iconFile from '../../assets/icon-file.svg';
import iconFilePlus from '../../assets/icon-file-plus.svg';
import iconClock from '../../assets/icon-clock-sm.svg';
import styles from '../../pages/notes/notes.module.css';

import File from './File';

import { useEffect, useState } from 'react';

function timeAgo(timestamp) {
  return "test"
}

export default function Note({title, cardTitle, body, timestamp, onChange, id}) {

    const [goalCompletion, setGoalCompletion] = useState(0)

    //TODO - Make a function that saves note content to the database
    const pushChanges = () => {
      //Code goes here
    }

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
                        <div className={styles.progressFill} style={{ width: `${goalCompletion}%` }} />
                      </div>
                    </div>
                    <span className={styles.progressPercent} style={{display: 'flex', alignItems: 'center'}}><input style={{width:60}} value={goalCompletion} type='number' max={100} min={0} defaultValue={0} onChange={(e) => setGoalCompletion(e.target.value)}/>%</span>
                  </div>
                </header>
        
                <article className={styles.card}>
                  <header className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>
                        <input placeholder='Insert Title Here' value={cardTitle} onChange={(e) => onChange(title, 'caardTitle', e.target.value)}/></h3>
                  </header>
                  <p className={styles.japaneseText}>
                    <input placeholder='Insert Body Here' value={body} onChange={(e) => onChange(title, 'body', e.target.value)}/>
                  </p>
                </article>
        <button>Save</button>
              </div>
    )
}