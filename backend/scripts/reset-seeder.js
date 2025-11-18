const { sequelize } = require('../src/models');

async function reset() {
  try {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.query('TRUNCATE TABLE petani');
    await sequelize.query('TRUNCATE TABLE kelompok_tani');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Tables truncated and AUTO_INCREMENT reset successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

reset();
