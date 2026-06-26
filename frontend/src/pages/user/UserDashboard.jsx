import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Search, TrendingUp, Store } from 'lucide-react';
import { dashboardAPI } from '../../services/api';
import StatCard from '../../components/ui/StatCard';
import { StarDisplay } from '../../components/ui/RatingStars';
import PageTransition from '../../components/ui/PageTransition';
import { StatCardSkeleton } from '../../components/ui/Skeleton';
import { formatDate } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.getUserStats()
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const recentRatings = stats?.recentRatings || [];

  return (
    <PageTransition>
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text">
          Good day, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-500 dark:text-dark-muted text-sm mt-0.5">Here's your rating activity overview.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 3 }, (_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Stores Rated"
              value={stats?.totalRatings || 0}
              icon={Star}
              iconColor="text-yellow-500"
              iconBg="bg-yellow-50 dark:bg-yellow-900/20"
              delay={0}
            />
            <StatCard
              title="Avg Rating Given"
              value={stats?.avgRatingGiven || 0}
              icon={TrendingUp}
              iconColor="text-green-600"
              iconBg="bg-green-50 dark:bg-green-900/20"
              isFloat
              delay={0.05}
            />
            <StatCard
              title="Stores Discovered"
              value={stats?.storesDiscovered || 0}
              icon={Store}
              iconColor="text-primary-600"
              iconBg="bg-primary-50 dark:bg-primary-900/20"
              delay={0.1}
              className="col-span-2 lg:col-span-1"
            />
          </>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Link to="/stores" className="card-hover p-6 flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            🔍
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-dark-text">Discover Stores</h3>
            <p className="text-sm text-gray-500 dark:text-dark-muted">Browse and rate stores near you</p>
          </div>
        </Link>
        <Link to="/my-ratings" className="card-hover p-6 flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            ⭐
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-dark-text">My Ratings</h3>
            <p className="text-sm text-gray-500 dark:text-dark-muted">View and manage your reviews</p>
          </div>
        </Link>
      </div>

      {/* Recent ratings */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 dark:text-dark-text">Recent Ratings</h3>
          <Link to="/my-ratings" className="text-sm text-primary-600 hover:text-primary-700 transition-colors">
            View all
          </Link>
        </div>

        {recentRatings.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-3 animate-float">⭐</div>
            <p className="text-gray-500 dark:text-dark-muted text-sm">No ratings yet.</p>
            <Link to="/stores" className="btn btn-primary btn-sm mt-3">Rate a Store</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentRatings.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🏪</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-text">{r.store?.name}</p>
                    <p className="text-xs text-gray-400 dark:text-dark-muted">{formatDate(r.createdAt)}</p>
                  </div>
                </div>
                <StarDisplay rating={r.rating} size={14} showValue />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default UserDashboard;
