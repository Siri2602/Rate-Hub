import { prisma } from '../server.js';

const storeInclude = {
  owner: { select: { id: true, name: true, email: true } },
  _count: { select: { ratings: true } },
  ratings: { select: { rating: true } },
};

const computeAvg = (ratings) => {
  if (!ratings?.length) return 0;
  return ratings.reduce((s, r) => s + r.rating, 0) / ratings.length;
};

const formatStore = (store) => ({
  ...store,
  ratings: undefined,
  avgRating: computeAvg(store.ratings),
  totalRatings: store._count?.ratings || 0,
});

export const getAllStores = async (req, res, next) => {
  try {
    const { search, sort = 'name_asc', minRating, page = 1, limit = 50 } = req.query;

    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    } : {};

    let orderBy = { name: 'asc' };
    if (sort === 'name_desc') orderBy = { name: 'desc' };
    else if (sort === 'newest') orderBy = { createdAt: 'desc' };
    else if (sort === 'oldest') orderBy = { createdAt: 'asc' };

    const stores = await prisma.store.findMany({
      where,
      include: storeInclude,
      orderBy,
    });

    let result = stores.map(formatStore);

    if (minRating) {
      result = result.filter(s => s.avgRating >= parseFloat(minRating));
    }

    if (sort === 'rating_desc') result.sort((a, b) => b.avgRating - a.avgRating);
    if (sort === 'rating_asc') result.sort((a, b) => a.avgRating - b.avgRating);

    // Paginate in memory (after filter/sort)
    const total = result.length;
    const paginated = result.slice((parseInt(page) - 1) * parseInt(limit), parseInt(page) * parseInt(limit));

    res.json({ stores: paginated, total });
  } catch (err) {
    next(err);
  }
};

export const getStoreById = async (req, res, next) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: req.params.id },
      include: {
        ...storeInclude,
        ratings: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!store) return res.status(404).json({ error: 'Store not found' });

    res.json({ store: formatStore(store) });
  } catch (err) {
    next(err);
  }
};

export const createStore = async (req, res, next) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const existing = await prisma.store.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Store email already exists' });

    const store = await prisma.store.create({
      data: { name, email, address, ...(ownerId && { ownerId }) },
      include: storeInclude,
    });

    res.status(201).json({ store: formatStore(store) });
  } catch (err) {
    next(err);
  }
};

export const updateStore = async (req, res, next) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (email) {
      const conflict = await prisma.store.findFirst({
        where: { email, NOT: { id: req.params.id } },
      });
      if (conflict) return res.status(409).json({ error: 'Email already in use' });
    }

    const store = await prisma.store.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(address && { address }),
        ...(ownerId !== undefined && { ownerId: ownerId || null }),
      },
      include: storeInclude,
    });

    res.json({ store: formatStore(store) });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Store not found' });
    next(err);
  }
};

export const deleteStore = async (req, res, next) => {
  try {
    await prisma.store.delete({ where: { id: req.params.id } });
    res.json({ message: 'Store deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Store not found' });
    next(err);
  }
};

export const getMyStore = async (req, res, next) => {
  try {
    const store = await prisma.store.findUnique({
      where: { ownerId: req.user.id },
      include: {
        ...storeInclude,
        ratings: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!store) return res.status(404).json({ error: 'No store found for this owner' });
    res.json({ store: formatStore(store) });
  } catch (err) {
    next(err);
  }
};
