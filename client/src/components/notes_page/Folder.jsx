import iconFolderPlus from '../../assets/icon-folder-plus.svg';
import iconFolderMinus from '../../assets/icon-folder-minus.svg';
import iconFile from '../../assets/icon-file.svg';
import iconFilePlus from '../../assets/icon-file-plus.svg';
import styles from '../../pages/notes/notes.module.css';

import File from './File';
import { useEffect, useState, useRef } from 'react';

const iconFor = {
  'folder-plus': iconFolderPlus,
  'folder-minus': iconFolderMinus,
  'file': iconFile,
  'file-plus': iconFilePlus,
};

export default function Folder({ id, label, currentFile, setCurrentFile, onAdd, onRemove, children, removeNote, displayNote}) {

  const [showSub, setShowSub] = useState(false);
  const icon = showSub ? 'folder-minus' : 'folder-plus';

  const [isAddingFile, setIsAddingFile] = useState(false);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newName, setNewName] = useState('');


  function confirm(isDir) {
    if (newName.trim()) {
      onAdd(id, {id: crypto.randomUUID(), label: newName, dir: isDir, children: isDir ? [] : null});
    }
    setNewName('');
    setIsAddingFile(false);
    setIsAddingFolder(false);
  }

  return (
    <>
      <span className={styles.fileContainer} style={{ display: 'flex', gap: 10 }}>

        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setShowSub(v => !v)}
            type="button"
            className={styles.fileItem}
          >
            <img src={iconFor[icon]} alt="" className={styles.fileIcon} />
            <span>{label}</span>
          </button>
        </span>

        <span style={{ alignItems: 'center', display: 'flex', gap: 2 }}>
          <button className={styles.hoverButton} onClick={() => setIsAddingFolder(true)}>
            <img src={iconFor['folder-plus']} alt="" className={styles.fileIcon} />
          </button>
          <button className={styles.hoverButton} onClick={() => setIsAddingFile(true)}>
            <img src={iconFor['file-plus']} alt="" className={styles.fileIcon} />
          </button>
          <button className={styles.hoverButton} onClick={() => onRemove(id)}>
            X
          </button>
        </span>

      </span>

      {isAddingFile && (
        <form onSubmit={e => { e.preventDefault(); confirm(false); }}>
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Note name..."
          />
        </form>
      )}

      {isAddingFolder && (
        <form onSubmit={e => { e.preventDefault(); confirm(true); }}>
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Folder name..."
          />
        </form>
      )}

      {showSub && (
        <div style={{ paddingLeft: 16 }}>
          {children.map((child, i) =>
            child.dir ? (
              <Folder
                key={i}
                id={child.id}
                label={child.label}
                currentFile={currentFile}
                setCurrentFile={setCurrentFile}
                onAdd={onAdd}
                onRemove={onRemove}
                children={child.children}
                removeNote={removeNote}
                displayNote={displayNote}
              />
            ) : (
            <File 
              key={i} 
              id={child.id} 
              label={child.label} 
              dir={child.dir} 
              currentFile={currentFile} 
              setCurrentFile={setCurrentFile} 
              onRemove={onRemove}
              children={null}
              removeNote={removeNote}
              displayNote={displayNote}
            />
            )
          )}
        </div>
      )}
    </>
  );
}