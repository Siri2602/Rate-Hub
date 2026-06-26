import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Store, Star, BarChart2,
  User, Search, Heart, Settings, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES, getRoleLabel } from '../../utils/helpers';
import Avatar from '../ui/Avatar';
import { cn } from '../../utils/helpers';

const NAV = {
  [ROLES.ADMIN]: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/admin' },
    { label: 'Users', icon: Users, to: '/admin/users' },
    { label: 'Stores', icon: Store, to: '/admin/stores' },
    { label: 'Ratings', icon: Star, to: '/admin/ratings' },
  ],
  [ROLES.STORE_OWNER]: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/owner' },
    { label: 'My Store', icon: Store, to: '/owner/store' },
    { label: 'Reviews', icon: Star, to: '/owner/reviews' },
    { label: 'Analytics', icon: BarChart2, to: '/owner/analytics' },
  ],
  [ROLES.USER]: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
    { label: 'Discover Stores', icon: Search, to: '/stores' },
    { label: 'My Ratings', icon: Star, to: '/my-ratings' },
    { label: 'Favorites', icon: Heart, to: '/favorites' },
  ],
};

const SidebarLink = ({ item, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === item.to ||
    (item.to !== '/admin' && item.to !== '/dashboard' && item.to !== '/owner' && location.pathname.startsWith(item.to));

  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      className={cn(
        'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
        isActive
          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
          : 'text-gray-600 dark:text-dark-muted hover:bg-gray-100 dark:hover:bg-dark-bg hover:text-gray-900 dark:hover:text-dark-text'
      )}
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 bg-primary-50 dark:bg-primary-900/20 rounded-xl"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <item.icon size={17} className="relative z-10 flex-shrink-0" />
      <span className="relative z-10 flex-1">{item.label}</span>
      {isActive && <ChevronRight size={14} className="relative z-10 text-primary-500" />}
    </NavLink>
  );
};

const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth();
  const navItems = NAV[user?.role] || NAV[ROLES.USER];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* User info */}
      <div className="px-4 py-4 border-b border-gray-100 dark:border-dark-border">
        <div className="flex items-center gap-3">
          <Avatar name={user?.name} size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-dark-text truncate">{user?.name}</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium mt-0.5">
              {getRoleLabel(user?.role)}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <SidebarLink key={item.to} item={item} onClick={onClose} />
        ))}

        <div className="pt-4 mt-4 border-t border-gray-100 dark:border-dark-border">
          <SidebarLink item={{ label: 'Profile', icon: User, to: '/profile' }} onClick={onClose} />
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-dark-border">
        <p className="text-xs text-gray-400 dark:text-dark-muted">
          RateHub v1.0 · <span className="gradient-text font-medium">Discover. Rate. Improve.</span>
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 fixed left-0 top-14 bottom-0 bg-white dark:bg-dark-card border-r border-gray-100 dark:border-dark-border z-30 overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-dark-card border-r border-gray-100 dark:border-dark-border z-50 overflow-y-auto pt-14"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
