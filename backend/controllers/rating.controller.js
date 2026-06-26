import { prisma } from '../server.js';

const ratingInclude = {
  user: { select: { id: true, name: true, email: true } },
  store: { select: { id: true, name: true, address: true } },
};

export const getAllRatings = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, sort = 'createdAt', order = 'desc' } = req.query;

    const ratings = await prisma.rating.findMany({
      include: ratingInclude,
      orderBy: { [sort]: order },
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
    });

    const total = await prisma.rating.count();
    res.json({ ratings, total });
  } catch (err) {
    next(err);
  }
};

export const getRatingsByStore = async (req, res, next) => {
  try {
    const ratings = await prisma.rating.findMany({
      where: { storeId: req.params.storeId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ ratings });
  } catch (err) {
    next(err);
  }
};

export const getUserRatings = async (req, res, next) => {
  try {
    const ratings = await prisma.rating.findMany({
      where: { userId: req.user.id },
      include: { store: { select: { id: true, name: true, address: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ ratings });
  } catch (err) {
    next(err);
  }
};

export const submitRating = async (req, res, next) => {
  try {
    const { storeId, rating } = req.body;

    // Check store exists
    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) return res.status(404).json({ error: 'Store not found' });

    // Check existing
    const existing = await prisma.rating.findUnique({
      where: { userId_storeId: { userId: req.user.id, storeId } },
    });
    if (existing) {
      return res.status(409).json({ error: 'You have already rated this store. Use update instead.' });
    }

    const newRating = await prisma.rating.create({
      data: { rating, userId: req.user.id, storeId },
      include: ratingInclude,
    });

    res.status(201).json({ rating: newRating });
  } catch (err) {
    next(err);
  }
};

export const updateRating = async (req, res, next) => {
  try {
    const { rating } = req.body;

    const existing = await prisma.rating.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Rating not found' });

    // Only owner or admin can update
    if (existing.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to update this rating' });
    }

    const updated = await prisma.rating.update({
      where: { id: req.params.id },
      data: { rating },
      include: ratingInclude,
    });

    res.json({ rating: updated });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Rating not found' });
    next(err);
  }
};

export const deleteRating = async (req, res, next) => {
  try {
    const existing = await prisma.rating.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Rating not found' });

    if (existing.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to delete this rating' });
    }

    await prisma.rating.delete({ where: { id: req.params.id } });
    res.json({ message: 'Rating deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Rating not found' });
    next(err);
  }
};
