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


export default function File ({name, dir, setCurrentFIle}){
    const note = <Note title={name}></Note>
    return(
        <button draggable="true" onClick={() => setCurrentFIle(name)} type="button" className={`${styles.fileItem}`}>
                <img src={iconFor['file']} alt="" className={styles.fileIcon} />
                <span>{name}</span>
        </button>
    )
}