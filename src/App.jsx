import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Calendar from './pages/calendar';
import Dashboard from './pages/dashboard';
import Login from './pages/login';
import NoteEditor from './pages/noteEditor';
import Notes from './pages/notes';
import Profile from './pages/profile';
import Settings from './pages/settings';  
import SignUp from './pages/signup';
import TaskDetails from './pages/taskDetails';
import Timer from './pages/timer';

import './App.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="App">
        <Router>
          <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/timer" element={<Timer />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/note-editor" element={<NoteEditor />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/task/:id" element={<TaskDetails />} />
          </Routes>
        </Router>

      </div>
    </>
  )
}

export default App
