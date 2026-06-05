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

export default function Folder({ node, path, currentFile, setCurrentFile, onAdd, onRemove }) {
  const { label, children = [] } = node;

  // Collapse / expand
  const [showSub, setShowSub] = useState(false);
  const icon = showSub ? 'folder-minus' : 'folder-plus';

  // Inline input for new file / folder
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newItemLabel, setNewItemLabel] = useState('');
  const addInputRef = useRef(null);

  useEffect(() => {
    if (isAddingFile || isAddingFolder) addInputRef.current?.focus();
  }, [isAddingFile, isAddingFolder]);

  function commitItem(isDir) {
    const trimmed = newItemLabel.trim();
    if (trimmed) {
      onAdd(isDir ? 'folder-plus' : 'file', trimmed, isDir, path);
    }
    setNewItemLabel('');
    setIsAddingFile(false);
    setIsAddingFolder(false);
  }

  const removeChild = (childLabel) => onRemove(childLabel, path);

  return (
    <>
      {/* Folder row */}
      <span className={styles.fileContainer} style={{ display: 'flex', gap: 10 }}>

        {/* Folder toggle button */}
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

        {/* Add folder / add file / delete self */}
        <span style={{ alignItems: 'center', display: 'flex', gap: 2 }}>
          <button className={styles.hoverButton} onClick={() => setIsAddingFolder(true)}>
            <img src={iconFor['folder-plus']} alt="" className={styles.fileIcon} />
          </button>
          <button className={styles.hoverButton} onClick={() => setIsAddingFile(true)}>
            <img src={iconFor['file-plus']} alt="" className={styles.fileIcon} />
          </button>
          <button className={styles.hoverButton} onClick={() => onRemove(label, path.slice(0, -1))}>
            X
          </button>
        </span>

      </span>

      {/* Inline input — new file */}
      {isAddingFile && (
        <form onSubmit={e => { e.preventDefault(); commitItem(false); }}>
          <input
            ref={addInputRef}
            value={newItemLabel}
            onChange={e => setNewItemLabel(e.target.value)}
            onBlur={() => commitItem(false)}
            placeholder="Note name..."
          />
        </form>
      )}

      {/* Inline input — new folder */}
      {isAddingFolder && (
        <form onSubmit={e => { e.preventDefault(); commitItem(true); }}>
          <input
            ref={addInputRef}
            value={newItemLabel}
            onChange={e => setNewItemLabel(e.target.value)}
            onBlur={() => commitItem(true)}
            placeholder="Folder name..."
          />
        </form>
      )}

      {/* Children — only rendered when expanded */}
      {showSub && (
        <div style={{ paddingLeft: 16 }}>
          {children.map((child, i) =>
            child.dir ? (
              <Folder
                key={i}
                node={child}
                path={[...path, child.label]}
                currentFile={currentFile}
                setCurrentFile={setCurrentFile}
                onAdd={onAdd}
                onRemove={onRemove}
              />
            ) : (
              <File
                key={i}
                name={child.label}
                dir={child.dir}
                currentFile={currentFile}
                setCurrentFile={setCurrentFile}
                parentRemoveFile={removeChild}
              />
            )
          )}
        </div>
      )}
    </>
  );
}