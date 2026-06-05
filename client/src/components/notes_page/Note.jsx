import iconFolderPlus from '../../assets/icon-folder-plus.svg';
import iconFolderMinus from '../../assets/icon-folder-minus.svg';
import iconFile from '../../assets/icon-file.svg';
import iconFilePlus from '../../assets/icon-file-plus.svg';
import iconClock from '../../assets/icon-clock-sm.svg';
import styles from '../../pages/notes/notes.module.css';

import File from './File';

import { useEffect, useState } from 'react';

function timeAgo(timestamp) {
  if (!timestamp) return 'Never edited';
  const diff = Math.floor((Date.now() - timestamp) / 1000); // seconds ago

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}hr ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function Note({title, cardTitle, body, lastEdited, onChange}) {

    const [goalCompletion, setGoalCompletion] = useState(0)
    return (
        <div className={styles.content}>
                <header className={styles.headerRow}>
                  <div className={styles.headerMeta}>
                    <h2 className={styles.heading}>{title}</h2>
                    <div className={styles.subhead}>
                      <img src={iconClock} alt="" className={styles.subheadIcon} />
                      <span className={styles.subheadText}>Last edited: {timeAgo(lastEdited)}</span>
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
                        <input placeholder='Insert Title Here' value={cardTitle} onChange={(e) => onChange(title, 'cardTitle', e.target.value)}/></h3>
                  </header>
                  <p className={styles.japaneseText}>
                    <input placeholder='Insert Body Here' value={body} onChange={(e) => onChange(title, 'body', e.target.value)}/>
                  </p>
                </article>
              </div>
    )
}