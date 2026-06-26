import { prisma } from '../server.js';
import { subMonths, format, startOfMonth, endOfMonth } from 'date-fns';

const getMonthlyData = async (months = 6) => {
  const data = [];
  for (let i = months - 1; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const label = format(date, 'MMM');

    const [reviews, stores] = await Promise.all([
      prisma.rating.count({ where: { createdAt: { gte: start, lte: end } } }),
      prisma.store.count({ where: { createdAt: { gte: start, lte: end } } }),
    ]);

    data.push({ month: label, reviews, stores });
  }
  return data;
};

export const getAdminStats = async (req, res, next) => {
  try {
    const [totalUsers, totalStores, totalRatings, allRatings, recentRatings, monthlyData] =
      await Promise.all([
        prisma.user.count(),
        prisma.store.count(),
        prisma.rating.count(),
        prisma.rating.findMany({ select: { rating: true } }),
        prisma.rating.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { name: true } },
            store: { select: { name: true } },
          },
        }),
        getMonthlyData(6),
      ]);

    const avgRating = allRatings.length
      ? allRatings.reduce((s, r) => s + r.rating, 0) / allRatings.length
      : 0;

    // Rating distribution
    const ratingDistribution = [1, 2, 3, 4, 5].map(r => ({
      rating: `${r}★`,
      count: allRatings.filter(ar => ar.rating === r).length,
    }));

    // Users by role
    const roleCounts = await prisma.user.groupBy({
      by: ['role'],
      _count: true,
    });
    const usersByRole = roleCounts.map(r => ({
      name: r.role === 'ADMIN' ? 'Admins' : r.role === 'STORE_OWNER' ? 'Store Owners' : 'Users',
      value: r._count,
    }));

    // Recent activity (simulated from recent ratings and users)
    const recentUsers = await prisma.user.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: { name: true, role: true, createdAt: true },
    });

    const recentActivity = [
      ...recentRatings.slice(0, 4).map(r => ({
        description: `${r.user.name} rated ${r.store.name} (${r.rating}★)`,
        createdAt: r.createdAt,
      })),
      ...recentUsers.map(u => ({
        description: `New ${u.role.toLowerCase().replace('_', ' ')} registered: ${u.name}`,
        createdAt: u.createdAt,
      })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);

    res.json({
      totalUsers,
      totalStores,
      totalRatings,
      avgRating: parseFloat(avgRating.toFixed(2)),
      ratingDistribution,
      usersByRole,
      storeGrowth: monthlyData.map(d => ({ month: d.month, stores: d.stores })),
      recentRatings,
      recentActivity,
    });
  } catch (err) {
    next(err);
  }
};

export const getOwnerStats = async (req, res, next) => {
  try {
    const store = await prisma.store.findUnique({
      where: { ownerId: req.user.id },
      include: { ratings: { include: { user: { select: { name: true } } } } },
    });

    if (!store) return res.status(404).json({ error: 'No store found' });

    const totalReviews = store.ratings.length;
    const avgRating = totalReviews
      ? store.ratings.reduce((s, r) => s + r.rating, 0) / totalReviews
      : 0;

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const monthlyReviews = store.ratings.filter(r => r.createdAt >= thisMonthStart).length;
    const lastMonthReviews = store.ratings.filter(
      r => r.createdAt >= lastMonthStart && r.createdAt <= lastMonthEnd
    ).length;

    const monthlyChange = lastMonthReviews > 0
      ? Math.round(((monthlyReviews - lastMonthReviews) / lastMonthReviews) * 100)
      : 0;

    // Build 6-month trends
    const ratingTrend = [];
    const avgRatingTrend = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(now, i);
      const label = format(date, 'MMM');
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      const monthRatings = store.ratings.filter(r => r.createdAt >= start && r.createdAt <= end);
      const monthAvg = monthRatings.length
        ? monthRatings.reduce((s, r) => s + r.rating, 0) / monthRatings.length
        : 0;

      ratingTrend.push({ month: label, reviews: monthRatings.length });
      avgRatingTrend.push({ month: label, avg: parseFloat(monthAvg.toFixed(2)) });
    }

    const ratingDistribution = [1, 2, 3, 4, 5].map(n => ({
      rating: n,
      count: store.ratings.filter(r => r.rating === n).length,
    }));

    res.json({
      storeName: store.name,
      avgRating: parseFloat(avgRating.toFixed(2)),
      totalReviews,
      monthlyReviews,
      monthlyChange,
      ratingChange: parseFloat((avgRating - 3.5).toFixed(2)),
      ratingTrend,
      avgRatingTrend,
      ratingDistribution,
      recentReviews: store.ratings
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10),
    });
  } catch (err) {
    next(err);
  }
};

export const getUserStats = async (req, res, next) => {
  try {
    const [ratings, totalStores] = await Promise.all([
      prisma.rating.findMany({
        where: { userId: req.user.id },
        include: { store: { select: { id: true, name: true, address: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.store.count(),
    ]);

    const totalRatings = ratings.length;
    const avgRatingGiven = totalRatings
      ? parseFloat((ratings.reduce((s, r) => s + r.rating, 0) / totalRatings).toFixed(2))
      : 0;

    res.json({
      totalRatings,
      avgRatingGiven,
      storesDiscovered: totalStores,
      recentRatings: ratings.slice(0, 5),
    });
  } catch (err) {
    next(err);
  }
};
