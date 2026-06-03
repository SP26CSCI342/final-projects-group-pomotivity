import iconFolderPlus from '../../assets/icon-folder-plus.svg';
import iconFolderMinus from '../../assets/icon-folder-minus.svg';
import iconFile from '../../assets/icon-file.svg';
import iconFilePlus from '../../assets/icon-file-plus.svg';
import iconClock from '../../assets/icon-clock-sm.svg';
import styles from '../../pages/notes/notes.module.css';

import File from './File';

import { useEffect, useState } from 'react';

const iconFor = {
  'folder-plus': iconFolderPlus,
  'folder-minus': iconFolderMinus,
  'file': iconFile,
  'file-plus': iconFilePlus,
};

let files = [{ type: 'file', label: 'Overview', dir: false }]


export default function Folder ({name, dir, setCurrentFIle}){

    const [showSub, setShowSub] = useState(false)
    const [icon, setIcon] = useState('folder-plus')

    useEffect(() => {
      showSub ? setIcon('folder-minus') : setIcon('folder-plus')
    }, [showSub])
    return(
      <>
        <button value={showSub} onClick={() => setShowSub(val => !val)} type="button" className={`${styles.fileItem}`}>
                <img src={iconFor[icon]} alt="" className={styles.fileIcon} />
                <span>{name}</span>
        </button>
        {showSub ?
            <div style={{paddingLeft: 50}}>
              {files.map((file, i) => (
                file.dir ?
                <Folder key={i} name={file.label} dir={file.dir} setCurrentFIle={setCurrentFIle}></Folder>
                : <File key={i} name={file.label} dir={file.dir} setCurrentFIle={setCurrentFIle}></File>
              ))}
              {/*<button>New..</button>*/}
            </div>
          :
          null
        }
      </>

    )
}