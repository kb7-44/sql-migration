import { writeFile } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const path = process.env.PATH || 'migrations';
const date = new Date();
const timestamp = date.getTime();
const fileName = process.argv[2] !== undefined ? process.argv[2] : 'migration_file';
const fileContent = ``;
writeFile(path + '/' + timestamp + '_' + fileName + '.sql', fileContent, function (err) {
  if (err) {
    return console.log(err);
  }
  console.log('migration file created');
});

