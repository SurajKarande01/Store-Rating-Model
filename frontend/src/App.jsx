import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminStores from './pages/AdminStores';
import AdminAddUser from './pages/AdminAddUser';
import AdminAddStore from './pages/AdminAddStore';
import UserStores from './pages/UserStores';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import ChangePassword from './pages/ChangePassword';

const App = () => {
  const { isAuthenticated, user } = useAuth();

  const getHomeRedirect = () => {
    if (!isAuthenticated) return '/login';
    const map = { admin: '/admin/dashboard', user: '/stores', store_owner: '/owner/dashboard' };
    return map[user?.role] || '/login';
  };

  return (
    <div className="app-container">
      <Toaster position="top-right" toastOptions={{
        style: { background: '#16213e', color: '#e8e8f0', border: '1px solid #2a2a40', borderRadius: '12px', fontSize: '0.875rem' },
        success: { iconTheme: { primary: '#10b981', secondary: '#16213e' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#16213e' } },
      }} />

      {isAuthenticated && <Navbar />}

      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to={getHomeRedirect()} /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to={getHomeRedirect()} /> : <Signup />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/stores" element={<ProtectedRoute roles={['admin']}><AdminStores /></ProtectedRoute>} />
        <Route path="/admin/add-user" element={<ProtectedRoute roles={['admin']}><AdminAddUser /></ProtectedRoute>} />
        <Route path="/admin/add-store" element={<ProtectedRoute roles={['admin']}><AdminAddStore /></ProtectedRoute>} />

        {/* Normal User Routes */}
        <Route path="/stores" element={<ProtectedRoute roles={['user']}><UserStores /></ProtectedRoute>} />

        {/* Store Owner Routes */}
        <Route path="/owner/dashboard" element={<ProtectedRoute roles={['store_owner']}><StoreOwnerDashboard /></ProtectedRoute>} />

        {/* Shared Routes */}
        <Route path="/change-password" element={<ProtectedRoute roles={['admin', 'user', 'store_owner']}><ChangePassword /></ProtectedRoute>} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to={getHomeRedirect()} />} />
      </Routes>
    </div>
  );
};

export default App;
