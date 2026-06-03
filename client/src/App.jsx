import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Calendar from './pages/calendar/calendar';
import Dashboard from './pages/dashboard/dashboard';
import Login from './pages/login/login';
import NoteEditor from './pages/noteEditor/noteEditor';
import Notes from './pages/notes/notes';
import Profile from './pages/profile/profile';
import Settings from './pages/settings/settings';
import SignUp from './pages/signup/signup';
import TaskDetails from './pages/taskDetails/taskDetails';
import Timer from './pages/timer/timer';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages have no sidebar */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route element={<ProtectedRoute/>}>
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
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
