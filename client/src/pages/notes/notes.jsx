import iconFolderPlus from '../../assets/icon-folder-plus.svg';
import iconFolderMinus from '../../assets/icon-folder-minus.svg';
import iconFile from '../../assets/icon-file.svg';
import iconFilePlus from '../../assets/icon-file-plus.svg';
import iconClock from '../../assets/icon-clock-sm.svg';
import styles from './notes.module.css';

import Folder from '../../components/notes_page/Folder';
import File from '../../components/notes_page/File';
import Note from '../../components/notes_page/Note';
import { useEffect, useState } from 'react';

const fileTree = [
  { type: 'folder-plus', label: 'CSCI 447', dir: true },
  { type: 'folder-minus', label: 'Japanese', dir: true },

  { type: 'folder-minus', label: 'Project 1', dir: true },
  { type: 'file', label: 'Overview', dir: false },
  { type: 'file', label: 'Check-in 1', dir: false },
  { type: 'file', label: 'Japanese Notes', dir: false },
  { type: 'file-plus', label: 'New Note...', dir: true },
];

const iconFor = {
  'folder-plus': iconFolderPlus,
  'folder-minus': iconFolderMinus,
  'file': iconFile,
  'file-plus': iconFilePlus,
};

export default function Notes() {

  const [currentFile, setCurrentFIle] = useState(null);

  const [noteContent, setNoteContents] = useState(() => {
    const saved = localStorage.getItem('notes');
    return saved ? JSON.parse(saved) : {};
  })

  const handleNoteChange = (filename, field, value) => {
    setNoteContents(prev => {
      const updated = {
        ...prev,
        [filename]: { ...prev[filename], [field]: value }
      };
      localStorage.setItem('notes', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    fileTree.map((item, i) => {
      console.log(`${i}: ${item}`)
    })
  }, [fileTree])
  return (
    <section className={styles.notes}>
      <div className={styles.fileDir}>
        <br/>
        {fileTree.map((item, i) => (

          fileTree[i].dir ?
          <Folder key={i} name={item.label} dir={item.dir} setCurrentFIle={setCurrentFIle}/>
          :
          <File key={i} name={item.label} dir={item.dir} setCurrentFIle={setCurrentFIle}/>

        ))}
      </div>

      {currentFile && (
        <Note 
          key={currentFile}
          title={currentFile}
          cardTitle={noteContent[currentFile]?.cardTitle ?? ""}
          body={noteContent[currentFile]?.body ?? ""}
          onChange={handleNoteChange}
      />
      )}
    </section>
  );
}
