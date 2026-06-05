import iconFolderPlus from '../../assets/icon-folder-plus.svg';
import iconFolderMinus from '../../assets/icon-folder-minus.svg';
import iconFile from '../../assets/icon-file.svg';
import iconFilePlus from '../../assets/icon-file-plus.svg';
import iconClock from '../../assets/icon-clock-sm.svg';
import styles from '../../pages/notes/notes.module.css';

import Note from './Note';

import { useEffect, useState } from 'react';

const iconFor = {
  'folder-plus': iconFolderPlus,
  'folder-minus': iconFolderMinus,
  'file': iconFile,
  'file-plus': iconFilePlus,
};


export default function File ({name, dir, currentFile, setCurrentFile, parentRemoveFile}){

    const note = <Note title={name}></Note>
    return(
        <span className={`${styles.fileContainer}`} style={{display:"flex", gap:10}}>
            <span style={{ display: "flex", alignItems: 'center', gap: 8}}>
                <button draggable="true" onClick={() => setCurrentFile(name)} type="button" className={`${styles.fileItem}`}>
                        
                    <img src={iconFor['file']} alt="" className={styles.fileIcon} />
                    <span>{name}</span>
                        
                </button>
            </span>
            <span style={{ alignItems: "center", display: "flex"}}>
                <button className={`${styles.hoverButton}`} onClick={() => parentRemoveFile(name)}>X</button>
            </span>
        </span>
    )
}