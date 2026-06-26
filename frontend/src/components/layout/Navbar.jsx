import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ChevronDown, LogOut, Settings, User, LayoutDashboard, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../ui/Logo';
import Avatar from '../ui/Avatar';
import ThemeToggle from '../ui/ThemeToggle';
import { getRoleLabel, ROLES } from '../../utils/helpers';

const Navbar = ({ onMenuToggle, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === ROLES.ADMIN) return '/admin';
    if (user.role === ROLES.STORE_OWNER) return '/owner';
    return '/dashboard';
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="glass fixed top-0 left-0 right-0 z-40 h-14 flex items-center px-4 gap-3 border-b border-gray-200/50 dark:border-dark-border/50"
    >
      {/* Menu toggle (dashboard pages) */}
      {user && (
        <button
          onClick={onMenuToggle}
          className="btn btn-ghost btn-sm p-1.5 lg:hidden"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      )}

      {/* Logo */}
      <Link to={user ? getDashboardPath() : '/'} className="flex-shrink-0">
        <Logo size="sm" />
      </Link>

      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        {!user ? (
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn btn-ghost btn-sm btn-md hidden sm:flex">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Get Started
            </Link>
          </div>
        ) : (
          <>
            {/* Notifications placeholder */}
            <button className="btn btn-ghost btn-sm p-1.5 relative" aria-label="Notifications">
              <Bell size={17} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full ring-2 ring-white dark:ring-dark-bg" />
            </button>

            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(o => !o)}
                className="flex items-center gap-2 btn btn-ghost btn-sm px-2 py-1"
                aria-expanded={profileOpen}
              >
                <Avatar name={user.name} size="sm" />
                <div className="hidden sm:flex flex-col items-start leading-none">
                  <span className="text-xs font-semibold text-gray-800 dark:text-dark-text">
                    {user.name?.split(' ')[0]}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-dark-muted">
                    {getRoleLabel(user.role)}
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className={`hidden sm:block text-gray-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 card border border-gray-100 dark:border-dark-border py-1 shadow-xl z-50"
                  >
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-border">
                      <p className="text-sm font-semibold text-gray-900 dark:text-dark-text truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-dark-muted truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to={getDashboardPath()}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors"
                      >
                        <LayoutDashboard size={15} className="text-gray-400" />
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors"
                      >
                        <User size={15} className="text-gray-400" />
                        Profile
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 dark:border-dark-border py-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2 text-sm text-danger hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
