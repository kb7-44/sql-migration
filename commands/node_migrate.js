const { createMigrationTable, getNextMigrationSeq, getFileToMigrate, migrateFile } = require('../mariadb/mariadb_migration.js');

const run = async () => {
  try {
    await createMigrationTable();
    const seq = await getNextMigrationSeq();
    const filesToMigrate = await getFileToMigrate();

    for (let i = 0; i < filesToMigrate.length; i++) {
      console.log('Migrating ' + filesToMigrate[i]);
      const res = await migrateFile(filesToMigrate[i], seq);
      if (!res) {
        break;
      }
      console.log(filesToMigrate[i] + ' Migrated');
    }
    process.exit(0);
  } catch (error) {
    console.log('migration failed: ' + error);
    process.exit(500);
  }
}

run();
