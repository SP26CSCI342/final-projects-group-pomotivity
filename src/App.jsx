import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages have no sidebar */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* App pages share the sidebar layout */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/timer" element={<Timer />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/note-editor" element={<NoteEditor />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/task/:id" element={<TaskDetails />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
