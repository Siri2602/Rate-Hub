import { motion } from 'framer-motion';

const PRESETS = {
  stores: { icon: '🏪', title: 'No Stores Found', desc: 'No stores match your search. Try different keywords.' },
  ratings: { icon: '⭐', title: 'No Ratings Yet', desc: 'Be the first to rate this store.' },
  users: { icon: '👥', title: 'No Users Found', desc: 'No users match your search criteria.' },
  reviews: { icon: '💬', title: 'No Reviews Yet', desc: 'Reviews will appear here once submitted.' },
  search: { icon: '🔍', title: 'No Results Found', desc: 'Try different keywords or filters.' },
  error: { icon: '⚠️', title: 'Something Went Wrong', desc: 'An error occurred. Please try again.' },
  default: { icon: '📭', title: 'Nothing Here', desc: 'This section is currently empty.' },
};

const EmptyState = ({ preset = 'default', title, description, action, icon }) => {
  const p = PRESETS[preset] || PRESETS.default;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 gap-4 text-center"
    >
      <div className="text-6xl mb-2 animate-float">{icon || p.icon}</div>
      <div>
        <h3 className="text-lg font-display font-semibold text-gray-700 dark:text-dark-text">
          {title || p.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-dark-muted mt-1 max-w-xs mx-auto">
          {description || p.desc}
        </p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </motion.div>
  );
};

export default EmptyState;
