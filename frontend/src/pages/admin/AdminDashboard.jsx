import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Store, Star, TrendingUp, Activity, Clock } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, Legend,
} from 'recharts';
import { dashboardAPI } from '../../services/api';
import StatCard from '../../components/ui/StatCard';
import PageTransition from '../../components/ui/PageTransition';
import { StatCardSkeleton } from '../../components/ui/Skeleton';
import Avatar from '../../components/ui/Avatar';
import { StarDisplay } from '../../components/ui/RatingStars';
import { formatDate, getRoleLabel } from '../../utils/helpers';
import { useTheme } from '../../context/ThemeContext';

const COLORS = ['#2563EB', '#7C3AED', '#22C55E', '#FBBF24'];

const ChartCard = ({ title, children }) => (
  <div className="card p-5">
    <h3 className="text-sm font-semibold text-gray-700 dark:text-dark-text mb-4">{title}</h3>
    {children}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 shadow-lg text-xs border border-gray-100 dark:border-dark-border">
      <p className="font-medium text-gray-700 dark:text-dark-text mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();
  const axisColor = isDark ? '#CBD5E1' : '#9CA3AF';
  const gridColor = isDark ? '#334155' : '#F3F4F6';

  useEffect(() => {
    dashboardAPI.getAdminStats()
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const ratingsDist = stats?.ratingDistribution || [1,2,3,4,5].map(r => ({ rating: `${r}★`, count: 0 }));
  const roleData = stats?.usersByRole || [
    { name: 'Users', value: stats?.totalUsers || 0 },
    { name: 'Store Owners', value: 0 },
    { name: 'Admins', value: 1 },
  ];
  const storeGrowth = stats?.storeGrowth || [];
  const recentActivity = stats?.recentActivity || [];
  const recentRatings = stats?.recentRatings || [];

  return (
    <PageTransition>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-dark-muted mt-0.5">Platform overview and analytics</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-dark-muted">
          <Activity size={13} className="text-green-500" />
          <span>Live</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 4 }, (_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Users"
              value={stats?.totalUsers}
              icon={Users}
              iconColor="text-primary-600"
              iconBg="bg-primary-50 dark:bg-primary-900/20"
              change={12}
              changeLabel="vs last month"
              delay={0}
            />
            <StatCard
              title="Total Stores"
              value={stats?.totalStores}
              icon={Store}
              iconColor="text-secondary-700"
              iconBg="bg-secondary-50 dark:bg-secondary-900/20"
              change={8}
              changeLabel="vs last month"
              delay={0.05}
            />
            <StatCard
              title="Total Ratings"
              value={stats?.totalRatings}
              icon={Star}
              iconColor="text-yellow-500"
              iconBg="bg-yellow-50 dark:bg-yellow-900/20"
              change={24}
              changeLabel="vs last month"
              delay={0.1}
            />
            <StatCard
              title="Average Rating"
              value={stats?.avgRating}
              icon={TrendingUp}
              iconColor="text-green-600"
              iconBg="bg-green-50 dark:bg-green-900/20"
              suffix="★"
              isFloat
              delay={0.15}
            />
          </>
        )}
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Ratings Distribution */}
        <ChartCard title="Ratings Distribution">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ratingsDist} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="rating" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#FBBF24" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Users by Role */}
        <ChartCard title="Users by Role">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={roleData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {roleData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(val) => <span className="text-xs text-gray-600 dark:text-dark-muted">{val}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Store Growth */}
        <ChartCard title="Store Growth (6M)">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={storeGrowth}>
              <defs>
                <linearGradient id="storeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="stores" stroke="#7C3AED" fill="url(#storeGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent Activity + Recent Ratings */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={15} className="text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-700 dark:text-dark-text">Recent Activity</h3>
          </div>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-400">No recent activity</div>
          ) : (
            <div className="space-y-3">
              {recentActivity.slice(0, 6).map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 dark:text-dark-text">{item.description}</p>
                    <p className="text-xs text-gray-400 dark:text-dark-muted">{formatDate(item.createdAt)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Ratings */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-dark-text mb-4">Recent Ratings</h3>
          {recentRatings.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-400">No ratings yet</div>
          ) : (
            <div className="space-y-3">
              {recentRatings.slice(0, 5).map((r, i) => (
                <motion.div
                  key={r.id || i}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors"
                >
                  <Avatar name={r.user?.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-text truncate">{r.user?.name}</p>
                    <p className="text-xs text-gray-400 dark:text-dark-muted truncate">rated {r.store?.name}</p>
                  </div>
                  <StarDisplay rating={r.rating} size={13} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
