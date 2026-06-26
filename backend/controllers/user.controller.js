import bcrypt from 'bcryptjs';
import { prisma } from '../server.js';

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  address: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { ratings: true } },
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { search, role, sort = 'createdAt', order = 'desc', page = 1, limit = 50 } = req.query;

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(role && { role }),
    };

    const orderBy = sort === 'name'
      ? { name: order }
      : sort === 'email'
      ? { email: order }
      : { createdAt: order };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: userSelect,
        orderBy,
        take: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ users, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        ...userSelect,
        ratings: {
          include: { store: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, address, role },
      select: userSelect,
    });

    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { name, email, address, role } = req.body;

    // Check email conflict
    if (email) {
      const conflict = await prisma.user.findFirst({
        where: { email, NOT: { id: req.params.id } },
      });
      if (conflict) return res.status(409).json({ error: 'Email already in use' });
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { ...(name && { name }), ...(email && { email }), ...(address && { address }), ...(role && { role }) },
      select: userSelect,
    });

    res.json({ user });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'User not found' });
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'User not found' });
    next(err);
  }
};
