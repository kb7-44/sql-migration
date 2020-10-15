#!/usr/bin/env node
const fs = require('fs');

const path = 'migrations';
const date = new Date();
const timestamp = date.getTime();
const fileName = process.argv[2] !== undefined ? process.argv[2] : 'migration_file';
const fileContent = ``;
if (!fs.existsSync(path)){
  fs.mkdirSync(path);
}
fs.writeFile(path + '/' + timestamp + '_' + fileName + '.sql', fileContent, function (err) {
  if (err) {
    return console.log(err);
  }
  console.log('migration file created');
});

