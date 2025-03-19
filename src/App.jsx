import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import History from './components/History';
import Admin from './components/Admin';
import Login from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';
import Register from './components/Register';
import { SidebarProvider } from './contexts/SidebarContext';
import { useSidebar } from './contexts/SidebarContext';

function App() {
  return (
    <Router> {/* Wrap the entire app with Router */}
      <AuthProvider>
        <SidebarProvider>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="*"
              element={
                <AppContent /> // Use AppContent here
              }
            />
          </Routes>
        </SidebarProvider>
      </AuthProvider>
    </Router>
  );
}

const AppContent = () => {
  const { isLoggedIn } = useAuth();
  const { isSidebarOpen } = useSidebar();

  return (
    <div className="flex h-screen relative">
      {isLoggedIn && <Sidebar />}
      <div
        className={`flex-grow flex flex-col py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto overflow-x-auto
          ${isSidebarOpen ? '' : 'sm:ml-0'}
        `}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/chat" />} />
          <Route path="/chat" element={isLoggedIn ? <Chat /> : <Navigate to="/login" />} />
          <Route path="/history" element={isLoggedIn ? <History /> : <Navigate to="/login" />} />
          <Route path="/admin" element={isLoggedIn ? <Admin /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;