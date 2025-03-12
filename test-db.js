const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Test the connection by running a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Database connection successful:', result);
    
    // Get database information
    const dbInfo = await prisma.$queryRaw`SELECT current_database(), current_schema(), version()`;
    console.log('Database info:', dbInfo);
    
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

testConnection()
  .then(success => {
    console.log('Test completed with status:', success ? 'SUCCESS' : 'FAILED');
    process.exit(success ? 0 : 1);
  })
  .catch(e => {
    console.error('Unexpected error:', e);
    process.exit(1);
  }); 