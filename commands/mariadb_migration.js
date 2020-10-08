import { execute } from '../mariadbConnector.js';
import { readdir, readFile } from 'fs';

export const getFileToMigrate = async () => {
  try {
    const migrationFiles = await _getFilesInMigrationsDirectory;
    const alreadyMigratedFiles = await _getFilesAlreadyMigrated();
    migrationFiles.sort();
    alreadyMigratedFiles.sort();

    const filesToMigrate = alreadyMigratedFiles.length > 0 ?
      migrationFiles.filter(migrationFile => !alreadyMigratedFiles.includes(migrationFile)) :
      migrationFiles;

    return filesToMigrate;

  } catch (error) {
    throw error;
  }
};

const _getFilesInMigrationsDirectory = new Promise((resolve, reject) => {
  readdir('databases/migrations/', (err, filenames) => {
    err ? reject(err) : resolve(filenames);
  });
});

const _getFilesAlreadyMigrated = async () => {
  const rows = await execute('SELECT name FROM migrations');
  return rows.length > 0 ? Array.from(rows.map(elt => elt.name)) : [];
}

export const createMigrationTable = async () => {
  try {
    const result = await execute(`

    CREATE TABLE IF NOT EXISTS migrations (
      id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
      name VARCHAR(191) NOT NULL,
      seq INT UNSIGNED NOT NULL,
      created_at timestamp NOT NULL DEFAULT current_timestamp(),
      updated_at timestamp NULL DEFAULT NULL
    );
    `);
  } catch (error) {
    throw error;
  }
};

export const getNextMigrationSeq = async () => {
  try {
    const result = await execute('SELECT seq FROM migrations ORDER BY id DESC LIMIT 1');
    return result.length > 0 ? result[0].seq + 1 : 1;
  } catch (error) {
    throw error;
  }
}

export const migrateFile = async (file, seq) => {
  try {
    const query = await _getFileContent(file);
    const resQry = await execute(query);
    const resMig = await execute('INSERT INTO migrations (name, seq) VALUES (?,?) ', [file, seq]);
    return true;
  } catch (error) {
    throw error;
  }
}

const _getFileContent = (file) => new Promise((resolve, reject) => {
  readFile('databases/migrations/' + file, 'utf8', (err, data) => {
    err ? reject(err) : resolve(data);
  });
});