import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { LogOut, Key, LayoutDashboard, Store, Users, User as UserIcon, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from './Logo';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const getLinks = () => {
    if (!user) return null;
    
    const navItems = {
      admin: [
        { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/admin/users', label: 'Users', icon: Users },
        { to: '/admin/stores', label: 'Stores', icon: Store },
      ],
      moderator: [
        { to: '/stores', label: 'Browse Stores', icon: Store },
        { to: '/admin/users', label: 'Users', icon: Users },
      ],
      user: [
        { to: '/stores', label: 'Browse Stores', icon: Store },
      ],
      store_owner: [
        { to: '/owner/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    };

    const items = navItems[user.role] || [];

    return (
      <div className="hidden md:flex items-center gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                active 
                  ? 'text-violet-400 bg-violet-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
              {active && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    );
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/15 text-red-400 border border-red-500/20';
      case 'store_owner':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/20';
      case 'moderator':
        return 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20';
      default:
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20';
    }
  };

  const getRoleLabel = (role) => {
    if (role === 'store_owner') return 'Owner';
    if (role === 'admin') return 'Admin';
    if (role === 'moderator') return 'Moderator';
    return 'Rater';
  };

  return (
    <nav className="glass-navbar border-slate-900 bg-slate-950/80 backdrop-blur-md px-6 py-3 flex items-center justify-between shadow-lg">
      <Link to="/" className="flex items-center gap-2 select-none group">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="bg-indigo-600/10 border border-indigo-500/20 p-1.5 rounded-xl text-indigo-400 shadow-md shadow-indigo-950/20"
        >
          <Logo className="w-5 h-5" />
        </motion.div>
        <span className="font-extrabold text-xl tracking-tight text-slate-100 group-hover:opacity-90 transition-opacity">
          Rate<span className="text-indigo-400">Pulse</span>
        </span>
      </Link>

      <div className="flex items-center gap-6">
        {getLinks()}

        {user && (
          <div className="flex items-center gap-4 border-l border-slate-800/80 pl-6">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-2 hover:bg-slate-900/60 p-1.5 rounded-xl border border-transparent hover:border-slate-800/80 transition-all outline-none text-left">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center font-bold text-sm text-white uppercase shadow-md shadow-violet-500/10">
                    {user.name ? user.name[0] : 'U'}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-semibold text-slate-200 leading-none truncate max-w-[100px]">
                      {user.name}
                    </p>
                    <span className={`inline-block mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${getRoleBadgeColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </div>
                  <ChevronDown size={14} className="text-slate-500 sm:block hidden" />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  sideOffset={8}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 min-w-[200px] shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-100"
                >
                  <div className="px-3 py-2 border-b border-slate-800/60 mb-1">
                    <p className="text-sm font-semibold text-slate-200">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                  </div>

                  <DropdownMenu.Item asChild>
                    <Link
                      to="/change-password"
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer outline-none ${
                        isActive('/change-password')
                          ? 'bg-violet-500/10 text-violet-400 font-medium'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <Key size={15} />
                      <span>Change Password</span>
                    </Link>
                  </DropdownMenu.Item>

                  <DropdownMenu.Separator className="h-[1px] bg-slate-800 my-1" />

                  <DropdownMenu.Item
                    onClick={logout}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer outline-none"
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
