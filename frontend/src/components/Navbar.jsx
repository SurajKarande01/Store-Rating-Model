import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const getLinks = () => {
    if (!user) return null;
    switch (user.role) {
      case 'admin':
        return (
          <>
            <Link to="/admin/dashboard" className={isActive('/admin/dashboard')}>Dashboard</Link>
            <Link to="/admin/users" className={isActive('/admin/users')}>Users</Link>
            <Link to="/admin/stores" className={isActive('/admin/stores')}>Stores</Link>
            <Link to="/change-password" className={isActive('/change-password')}>Password</Link>
          </>
        );
      case 'user':
        return (
          <>
            <Link to="/stores" className={isActive('/stores')}>Stores</Link>
            <Link to="/change-password" className={isActive('/change-password')}>Password</Link>
          </>
        );
      case 'store_owner':
        return (
          <>
            <Link to="/owner/dashboard" className={isActive('/owner/dashboard')}>Dashboard</Link>
            <Link to="/change-password" className={isActive('/change-password')}>Password</Link>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="navbar">
      <span className="navbar-brand">⭐ Store Rating </span>
      <div className="navbar-links">
        {getLinks()}
        {user && (
          <div className="nav-user-info">
            <span className={`nav-role-badge ${user.role}`}>
              {user.role === 'store_owner' ? 'Owner' : user.role}
            </span>
            <span className="nav-user-name">{user.name?.split(' ')[0]}</span>
            <button onClick={logout} className="btn btn-sm btn-danger">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
