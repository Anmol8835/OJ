require('dotenv').config();
const prisma = require('./database/prisma');

async function fixSequences() {
  try {
    // Fix the problems table sequence
    await prisma.$executeRawUnsafe(`
      SELECT setval(
        pg_get_serial_sequence('problems', 'id'),
        COALESCE(MAX(id), 1),
        true
      )
      FROM problems;
    `);

    console.log('✓ Fixed problems table ID sequence');

    // Fix the testcases table sequence
    await prisma.$executeRawUnsafe(`
      SELECT setval(
        pg_get_serial_sequence('testcases', 'id'),
        COALESCE(MAX(id), 1),
        true
      )
      FROM testcases;
    `);

    console.log('✓ Fixed testcases table ID sequence');

    console.log('\nAll sequences have been reset successfully!');
    console.log('You can now add problems without ID conflicts.');

  } catch (error) {
    console.error('Error fixing sequences:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSequences();
