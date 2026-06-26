import { useEffect, useState } from 'react';
import { dashboardAPI } from '../../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import PageTransition from '../../components/ui/PageTransition';
import { useTheme } from '../../context/ThemeContext';

const COLORS = ['#FBBF24', '#F97316', '#EF4444', '#22C55E', '#2563EB'];

const OwnerAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();
  const axisColor = isDark ? '#CBD5E1' : '#9CA3AF';
  const gridColor = isDark ? '#334155' : '#F3F4F6';

  useEffect(() => {
    dashboardAPI.getOwnerStats()
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const ratingDist = [5,4,3,2,1].map(n => ({
    name: `${n}★`,
    count: stats?.ratingDistribution?.find(r => r.rating === n)?.count || 0,
  }));

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-dark-text">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-dark-muted mt-0.5">Detailed store performance metrics</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-dark-text mb-4">Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={ratingDist} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 13 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: isDark ? '#1E293B' : '#fff',
                  border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
                  borderRadius: 10,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {ratingDist.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-dark-text mb-4">Rating Share</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={ratingDist}
                cx="50%"
                cy="50%"
                outerRadius={90}
                paddingAngle={3}
                dataKey="count"
                nameKey="name"
              >
                {ratingDist.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: isDark ? '#1E293B' : '#fff',
                  border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
                  borderRadius: 10,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </PageTransition>
  );
};

export default OwnerAnalytics;
