import { Navigate, Route, Routes } from 'react-router-dom';
import SplashScreen from './components/SplashScreen.jsx';
import { useAuth } from './context/AuthContext.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Dashboard from './pages/Dashboard.jsx';

// Only signed-in students can open the dashboard
function ProtectedRoute({ children }) {
  const { status } = useAuth();
  if (status === 'checking') return <SplashScreen />;
  return status === 'authed' ? children : <Navigate to="/login" replace />;
}

// Signed-in students are sent straight to the dashboard
function GuestRoute({ children }) {
  const { status } = useAuth();
  if (status === 'checking') return <SplashScreen />;
  return status === 'authed' ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><AuthPage mode="login" /></GuestRoute>} />
      <Route path="/signup" element={<GuestRoute><AuthPage mode="signup" /></GuestRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
