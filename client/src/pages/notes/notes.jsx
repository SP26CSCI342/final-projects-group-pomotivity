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

function findFile(id, tree){
  if(tree){
    return tree.map(item => (
      item.id == id ?
      item : findFile(id,item.children)
    ))
  }
}
function removeFromTree(id, tree) {

  return tree.filter(item =>
    item.id != id).map(item => (
      {...item, children: removeFromTree(id,item.children ? item.children : [])}
    )
  )
}

function addToTree(id, tree, file){ 

  return tree.map(item => {
    return item.id == id ?
     {...item, children: [...item.children, file]} : {...item, children: addToTree(id,item.children ? item.children : [],file)}
  })  

}

export default function Notes() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";


  const [fileTree, setFileTree] = useState([])
  const [notes, setNotes] = useState([])
  const [loaded, setLoaded] = useState(false)

    //Initializes the tree. Creates it if the user doesn't have an entry in the database
   useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) return;

      fetch(`${baseUrl}/api/files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`}
      })
      .then(() =>
      fetch(`${baseUrl}/api/files`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.files.tree)) {
            setFileTree(data.files.tree);
            setLoaded(true);
          }
        })
        .catch((error) => {
          console.error('Error loading files:', error);
        })
      );
    }, []);

  //Sends the updated file tree to the database whenever new files are created
  useEffect(() => {
    if (loaded){
      const token = localStorage.getItem('token');
      if (!token) return;

      fetch(`${baseUrl}/api/files`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
        body: JSON.stringify(fileTree)
      });
    }
  }, [fileTree])

  //NOTES
  const [noteContent, setNoteContent] = useState(null)

  //Initializes the ntoes collection. Creates it if the user doesn't have an entry in the database
   useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) return;

      fetch(`${baseUrl}/api/note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`}
      })
      .then(() =>
      fetch(`${baseUrl}/api/note`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.foundNotes.notes)) {
            setNotes(data.foundNotes.notes);
            setLoaded(true);
          }
        })
        .catch((error) => {
          console.error('Error loading notes:', error);
        })
      );
    }, []);

  

  //Sends the updated file tree to the database whenever new files are created
  useEffect(() => {
    if (loaded){
      const token = localStorage.getItem('token');
      if (!token) return;

      fetch(`${baseUrl}/api/note`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
        body: JSON.stringify(notes)
      });
    }
  }, [notes])
  



  {/* handles file creation */}
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [fileName, setFileName] = useState('');

  function confirm(isDir) {
    if (fileName.trim()) {
      addFile(null, {id: crypto.randomUUID(), label: fileName, dir: isDir, children: isDir ? [] : null});
    }
    setFileName('');
    setIsAddingFile(false);
    setIsAddingFolder(false);
  }


  const [currentFile, setCurrentFile] = useState(null);
  const [realCurrentFile, setRealCurrentFile] = useState(null)

  useEffect(() => {
    setRealCurrentFile(findFile(currentFile, fileTree))
  }, [currentFile])

  const addFile = (id, file) => {
    setFileTree(prev => {
      if(!file.isDir){
        createNote(file.id,file.label)
      }
      if (id == null) return [...prev, file]
      const newTree = addToTree(id,fileTree, file);
      return newTree;
    });
  };

  const removeFile = (id) => {
    setFileTree(prev => {
      const newTree = removeFromTree(id,prev);
      return newTree;
    });
  };

    const createNote = (id, name) => {
      setNotes([...notes, {id: id, name: name, title: "", body: "", progress: 0, timestamp: Date.now()}])
    };

    const removeNote = (id) => {
      setNotes(notes.filter(note => note.id != id))
    };

    const displayNote = (id) => {
      notes.map(note => {
          if(note.id == id){
            setNoteContent(note)
            return
          }
        }
      )
    }

    const changeNote = (id, content) => {
      const newNotes = notes.map(note => (
          note.id == id ?
            {...note, title: content.cardTitle, body: content.body, timestamp: content.timestamp, progress: content.progress }
          :
          {...note}
      ))
      setNotes(newNotes)
    }

  return (
    <section className={styles.notes}>
      <div className={styles.fileDir}>
        <br/>
        {fileTree.map((item, i) => (

          fileTree[i].dir ?
          <Folder
            key={i}
            id={item.id}
            label={item.label}
            currentFile={currentFile}
            setCurrentFile={setCurrentFile}
            onAdd={addFile}
            onRemove={removeFile}
            children={item.children}
            removeNote={removeNote}
            displayNote={displayNote}
          />
          :
          <File 
            key={i} 
            id={item.id} 
            label={item.label} 
            dir={item.dir} 
            currentFile={currentFile} 
            setCurrentFile={setCurrentFile} 
            onRemove={removeFile}
            children={null}
            removeNote={removeNote}
            displayNote={displayNote}
          />

        ))}
        {isAddingFile && (
          <form onSubmit={e => { e.preventDefault(); confirm(false); }}>
            <input
              value={fileName}
              onChange={e => setFileName(e.target.value)}
              placeholder="Note name..."
            />
          </form>
        )}
        {isAddingFolder && (
          <form onSubmit={e => { e.preventDefault(); confirm(true); }}>
            <input
              value={fileName}
              onChange={e => setFileName(e.target.value)}
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

      <div style={{overflow: 'auto', display: 'flex', flex: 1}}>
        {noteContent ?
        <Note 
            key={noteContent.id}
            title={noteContent.name}
            cardTitle={noteContent.title}
            body={noteContent.body}
            timestamp={noteContent.timestamp}
            onChange={changeNote}
            id={noteContent.id}
            progress={noteContent.progress}
        />
        :
        null}
      </div>
    </section>
);
}
