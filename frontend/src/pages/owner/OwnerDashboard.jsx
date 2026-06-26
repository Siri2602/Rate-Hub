import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Users, Calendar } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';
import { dashboardAPI } from '../../services/api';
import StatCard from '../../components/ui/StatCard';
import { StatCardSkeleton } from '../../components/ui/Skeleton';
import { StarDisplay } from '../../components/ui/RatingStars';
import PageTransition from '../../components/ui/PageTransition';
import Avatar from '../../components/ui/Avatar';
import { formatDate } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-xs shadow-lg border border-gray-100 dark:border-dark-border">
      <p className="font-medium text-gray-700 dark:text-dark-text mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

const OwnerDashboard = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const axisColor = isDark ? '#CBD5E1' : '#9CA3AF';
  const gridColor = isDark ? '#334155' : '#F3F4F6';

  useEffect(() => {
    dashboardAPI.getOwnerStats()
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const ratingTrend = stats?.ratingTrend || [];
  const avgTrend = stats?.avgRatingTrend || [];
  const recentReviews = stats?.recentReviews || [];

  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text">
          Store Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-dark-muted mt-0.5">
          {stats?.storeName || 'Your store'} · Performance overview
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 4 }, (_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Average Rating"
              value={stats?.avgRating || 0}
              icon={Star}
              iconColor="text-yellow-500"
              iconBg="bg-yellow-50 dark:bg-yellow-900/20"
              suffix="★"
              isFloat
              delay={0}
            />
            <StatCard
              title="Total Reviews"
              value={stats?.totalReviews || 0}
              icon={Users}
              iconColor="text-primary-600"
              iconBg="bg-primary-50 dark:bg-primary-900/20"
              delay={0.05}
            />
            <StatCard
              title="Monthly Reviews"
              value={stats?.monthlyReviews || 0}
              icon={Calendar}
              iconColor="text-secondary-700"
              iconBg="bg-secondary-50 dark:bg-secondary-900/20"
              change={stats?.monthlyChange || 0}
              changeLabel="vs prev month"
              delay={0.1}
            />
            <StatCard
              title="Rating Trend"
              value={stats?.ratingChange || 0}
              icon={TrendingUp}
              iconColor="text-green-600"
              iconBg="bg-green-50 dark:bg-green-900/20"
              suffix={stats?.ratingChange >= 0 ? '▲' : '▼'}
              isFloat
              delay={0.15}
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Rating volume trend */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-dark-text mb-4">Monthly Review Volume</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={ratingTrend}>
              <defs>
                <linearGradient id="reviewGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="reviews"
                name="Reviews"
                stroke="#2563EB"
                fill="url(#reviewGrad)"
                strokeWidth={2}
                dot={{ fill: '#2563EB', strokeWidth: 0, r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Avg rating trend */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-dark-text mb-4">Average Rating Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={avgTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 5]} tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="avg"
                name="Avg Rating"
                stroke="#FBBF24"
                strokeWidth={2.5}
                dot={{ fill: '#FBBF24', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Latest Reviews */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-800 dark:text-dark-text mb-4">Latest Reviews</h3>
        {recentReviews.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <div className="text-4xl mb-2 animate-float">⭐</div>
            <p className="text-sm">No reviews yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-dark-border">
            {recentReviews.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 py-3"
              >
                <Avatar name={r.user?.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-text">{r.user?.name}</p>
                  <p className="text-xs text-gray-400 dark:text-dark-muted">{formatDate(r.createdAt)}</p>
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

export default OwnerDashboard;
