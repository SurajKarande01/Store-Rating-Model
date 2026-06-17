import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/useAuthStore';
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

/**
 * App component.
 */
const App = () => {
  const { isAuthenticated, user } = useAuthStore();

  /**
   * getHomeRedirect utility/helper function.
   */
  const getHomeRedirect = () => {
    if (!isAuthenticated) return '/login';
    const map = { 
      admin: '/admin/dashboard', 
      user: '/stores', 
      moderator: '/stores',
      store_owner: '/owner/dashboard' 
    };
    return map[user?.role] || '/login';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#f1f5f9',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            fontSize: '0.875rem',
            padding: '12px 16px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#0f172a',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#0f172a',
            },
          },
        }}
      />

      {isAuthenticated && <Navbar />}

      <main className="flex-1">
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to={getHomeRedirect()} /> : <Login />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to={getHomeRedirect()} /> : <Signup />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute roles={['admin', 'moderator']}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/stores" element={<ProtectedRoute roles={['admin']}><AdminStores /></ProtectedRoute>} />
          <Route path="/admin/add-user" element={<ProtectedRoute roles={['admin']}><AdminAddUser /></ProtectedRoute>} />
          <Route path="/admin/add-store" element={<ProtectedRoute roles={['admin']}><AdminAddStore /></ProtectedRoute>} />

          {/* Normal User Routes */}
          <Route path="/stores" element={<ProtectedRoute roles={['user', 'moderator']}><UserStores /></ProtectedRoute>} />

          {/* Store Owner Routes */}
          <Route path="/owner/dashboard" element={<ProtectedRoute roles={['store_owner']}><StoreOwnerDashboard /></ProtectedRoute>} />

          {/* Shared Routes */}
          <Route path="/change-password" element={<ProtectedRoute roles={['admin', 'user', 'store_owner', 'moderator']}><ChangePassword /></ProtectedRoute>} />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to={getHomeRedirect()} />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
