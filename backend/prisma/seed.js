import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.rating.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  const hash = (pw) => bcrypt.hashSync(pw, 10);

  // Create admin
  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator RateHub Platform',
      email: 'admin@ratehub.com',
      password: hash('Admin@123'),
      address: '123 Admin Street, Tech City, State 400001',
      role: 'ADMIN',
    },
  });

  // Create store owners
  const owner1 = await prisma.user.create({
    data: {
      name: 'Rahul Sharma TechMart Store Owner',
      email: 'rahul@techmart.com',
      password: hash('Owner@123'),
      address: '45 Electronics Avenue, Mumbai, Maharashtra 400002',
      role: 'STORE_OWNER',
    },
  });

  const owner2 = await prisma.user.create({
    data: {
      name: 'Priya Patel BookNook Library Owner',
      email: 'priya@booknook.com',
      password: hash('Owner@123'),
      address: '78 Literary Lane, Pune, Maharashtra 411001',
      role: 'STORE_OWNER',
    },
  });

  const owner3 = await prisma.user.create({
    data: {
      name: 'Arjun Singh FreshGrocer Market Owner',
      email: 'arjun@freshgrocer.com',
      password: hash('Owner@123'),
      address: '12 Market Road, Delhi, New Delhi 110001',
      role: 'STORE_OWNER',
    },
  });

  // Create regular users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Sneha Mehta Regular Shopper Customer',
        email: 'user@ratehub.com',
        password: hash('User@123'),
        address: '56 Residential Colony, Bangalore, Karnataka 560001',
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Vikram Nair Online Shopper Customer User',
        email: 'vikram@example.com',
        password: hash('User@123'),
        address: '89 Palm Street, Chennai, Tamil Nadu 600001',
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Ananya Gupta Frequent Buyer Regular User',
        email: 'ananya@example.com',
        password: hash('User@123'),
        address: '34 Green Park, Hyderabad, Telangana 500001',
        role: 'USER',
      },
    }),
  ]);

  // Create stores
  const store1 = await prisma.store.create({
    data: {
      name: 'TechMart Electronics and Gadgets Store',
      email: 'contact@techmart.com',
      address: '45 Electronics Avenue, Lamington Road, Mumbai, Maharashtra 400002',
      ownerId: owner1.id,
    },
  });

  const store2 = await prisma.store.create({
    data: {
      name: 'BookNook Library and Stationery Shop',
      email: 'hello@booknook.com',
      address: '78 Literary Lane, Deccan Gymkhana, Pune, Maharashtra 411004',
      ownerId: owner2.id,
    },
  });

  const store3 = await prisma.store.create({
    data: {
      name: 'FreshGrocer Organic Market and Grocery',
      email: 'info@freshgrocer.com',
      address: '12 Market Road, Connaught Place, New Delhi 110001',
      ownerId: owner3.id,
    },
  });

  const store4 = await prisma.store.create({
    data: {
      name: 'StyleHub Fashion and Clothing Boutique',
      email: 'style@stylehub.com',
      address: '23 Fashion Street, Brigade Road, Bangalore, Karnataka 560025',
    },
  });

  const store5 = await prisma.store.create({
    data: {
      name: 'GadgetZone Mobile and Accessories Store',
      email: 'gadgets@gadgetzone.com',
      address: '67 Tech Park, Anna Nagar, Chennai, Tamil Nadu 600040',
    },
  });

  // Create ratings
  const storeList = [store1, store2, store3, store4, store5];
  const userList = [users[0], users[1], users[2], owner1, owner2];

  const ratingsData = [
    { userId: users[0].id, storeId: store1.id, rating: 5 },
    { userId: users[0].id, storeId: store2.id, rating: 4 },
    { userId: users[0].id, storeId: store3.id, rating: 3 },
    { userId: users[1].id, storeId: store1.id, rating: 4 },
    { userId: users[1].id, storeId: store3.id, rating: 5 },
    { userId: users[1].id, storeId: store4.id, rating: 4 },
    { userId: users[2].id, storeId: store1.id, rating: 5 },
    { userId: users[2].id, storeId: store2.id, rating: 5 },
    { userId: users[2].id, storeId: store5.id, rating: 3 },
    { userId: owner1.id, storeId: store2.id, rating: 4 },
    { userId: owner1.id, storeId: store4.id, rating: 3 },
    { userId: owner2.id, storeId: store1.id, rating: 4 },
    { userId: owner2.id, storeId: store5.id, rating: 2 },
  ];

  for (const r of ratingsData) {
    await prisma.rating.create({ data: r });
  }

  console.log('✅ Seed complete!');
  console.log('\n📋 Demo accounts:');
  console.log('  Admin:       admin@ratehub.com / Admin@123');
  console.log('  Store Owner: rahul@techmart.com / Owner@123');
  console.log('  User:        user@ratehub.com  / User@123');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
