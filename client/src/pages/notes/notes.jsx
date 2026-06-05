import iconFolderPlus from '../../assets/icon-folder-plus.svg';
import iconFolderMinus from '../../assets/icon-folder-minus.svg';
import iconFile from '../../assets/icon-file.svg';
import iconFilePlus from '../../assets/icon-file-plus.svg';
import iconClock from '../../assets/icon-clock-sm.svg';
import styles from './notes.module.css';

import Folder from '../../components/notes_page/Folder';
import File from '../../components/notes_page/File';
import Note from '../../components/notes_page/Note';
import { useEffect, useState, useRef } from 'react';

const iconFor = {
  'folder-plus': iconFolderPlus,
  'folder-minus': iconFolderMinus,
  'file': iconFile,
  'file-plus': iconFilePlus,
};


function addToTree(nodes, path, newNode) {
  if (path.length === 0) return [...nodes, newNode];
  return nodes.map(node =>
    node.label === path[0]
      ? { ...node, children: addToTree(node.children ?? [], path.slice(1), newNode) }
      : node
  );
}

function removeFromTree(nodes, path, label) {
  if (path.length === 0) return nodes.filter(n => n.label !== label);
  return nodes.map(node =>
    node.label === path[0]
      ? { ...node, children: removeFromTree(node.children ?? [], path.slice(1), label) }
      : node
  );
}

export default function Notes() {

  {/* handles file creation */}
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newItemLabel, setNewItemLabel] = useState('');
  const addInputRef = useRef(null);

  useEffect(() => {
  if (isAddingFile || isAddingFolder) addInputRef.current?.focus();
}, [isAddingFile, isAddingFolder]);

  function commitItem(isDir) {
    const label = newItemLabel.trim();
    if (label) {
      addFile(isDir ? 'folder-plus' : 'file', label, isDir);
    }
    setNewItemLabel('');
    setIsAddingFile(false);
    setIsAddingFolder(false);
  }


  const [currentFile, setCurrentFile] = useState(null);

  const [fileTree, setFileTree] = useState(() => {
    const savedFiles = localStorage.getItem('files');
    return savedFiles ? JSON.parse(savedFiles) : [];
  }
  )

  const addFile = (type, label, dir, parentPath = []) => {
    setFileTree(prev => {
      const updated = addToTree(prev, parentPath, { type, label, dir, children: [] });
      localStorage.setItem('files', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFile = (label, parentPath = []) => {
    setFileTree(prev => {
      const updated = removeFromTree(prev, parentPath, label);
      localStorage.setItem('files', JSON.stringify(updated));
      return updated;
    });
    if (currentFile === label) setCurrentFile(null);
  };

  const [noteContent, setNoteContents] = useState(() => {
    const saved = localStorage.getItem('notes');
    return saved ? JSON.parse(saved) : {};
  })

  const handleNoteChange = (filename, field, value) => {
    setNoteContents(prev => {
      const updated = {
        ...prev,
        [filename]: { ...prev[filename], [field]: value, lastEdited: Date.now()}
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
          <Folder
            key={i}
            node={item}
            path={[item.label]}         // track location in tree
            currentFile={currentFile}
            setCurrentFile={setCurrentFile}
            onAdd={addFile}
            onRemove={removeFile}
          />
          :
          <File key={i} name={item.label} dir={item.dir} currentFile={currentFile} setCurrentFile={setCurrentFile} parentRemoveFile={removeFile}/>

        ))}
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

        {!isAddingFile && !isAddingFolder && (
          <>
            <button onClick={() => setIsAddingFile(true)}>New Note</button>
            <button onClick={() => setIsAddingFolder(true)}>New Folder</button>
          </>
        )}
      </div>

      {currentFile && (
        <Note 
          key={currentFile}
          title={currentFile}
          cardTitle={noteContent[currentFile]?.cardTitle ?? ""}
          body={noteContent[currentFile]?.body ?? ""}
          lastEdited={noteContent[currentFile]?.lastEdited ?? null}
          onChange={handleNoteChange}
      />
      )}
    </section>
  );
}
