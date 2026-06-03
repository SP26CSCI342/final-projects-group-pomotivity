import iconFolderPlus from '../../assets/icon-folder-plus.svg';
import iconFolderMinus from '../../assets/icon-folder-minus.svg';
import iconFile from '../../assets/icon-file.svg';
import iconFilePlus from '../../assets/icon-file-plus.svg';
import iconClock from '../../assets/icon-clock-sm.svg';
import styles from '../../pages/notes/notes.module.css';

import File from './File';

import { useEffect, useState } from 'react';

export default function Note({title, cardTitle, body, onChange}) {


    return (
        <div className={styles.content}>
                <header className={styles.headerRow}>
                  <div className={styles.headerMeta}>
                    <h2 className={styles.heading}>{title}</h2>
                    <div className={styles.subhead}>
                      <img src={iconClock} alt="" className={styles.subheadIcon} />
                      <span className={styles.subheadText}>Last edited: 2hr 31min ago</span>
                    </div>
                  </div>
        
                  <div className={styles.progressCard}>
                    <div>
                      <p className={styles.progressLabel}>Goal Progress</p>
                      <div className={styles.progressTrack}>
                        <div className={styles.progressFill} style={{ width: '50%' }} />
                      </div>
                    </div>
                    <span className={styles.progressPercent}>50%</span>
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