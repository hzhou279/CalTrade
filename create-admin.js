const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcrypt');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Check if tables exist
    try {
      await prisma.user.findFirst();
      console.log('User table exists');
    } catch (error) {
      console.error('User table does not exist. Please run migrations first:', error.message);
      return false;
    }
    
    // Create admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@caltrade.com' },
      update: {
        role: 'admin',
        emailVerified: new Date(),
      },
      create: {
        email: 'admin@caltrade.com',
        name: 'Admin User',
        phone: '+12345678901',
        phoneVerified: new Date(),
        emailVerified: new Date(),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log('Admin user created or updated:', adminUser);
    
    console.log('\nTest Account Details:');
    console.log('---------------------');
    console.log('Email: admin@caltrade.com');
    console.log('Role: admin');
    console.log('Note: You can sign in with this email without a password in development mode');
    
    return true;
  } catch (error) {
    console.error('Error creating admin user:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser()
  .then(success => {
    console.log('\nAdmin user creation:', success ? 'SUCCESS' : 'FAILED');
    process.exit(success ? 0 : 1);
  })
  .catch(e => {
    console.error('Unexpected error:', e);
    process.exit(1);
  }); 