const { lstatSync, readdirSync } = require('fs');
const { dirname, join } = require('path');

function getRootDir() {
  return dirname(require.main.filename || process.mainModule.filename);
}

const isDirectory = source => lstatSync(source).isDirectory();

const getDirectories = source =>
  readdirSync(source)
    .map(name => join(source, name))
    .filter(isDirectory)
    .map(path => {
      const arr = path.split('/');
      return {
        type: arr[arr.length - 1],
        path,
      };
    });

function getDebateListings(folder, searchedType = '') {
  const directoryList = getDirectories(`${getRootDir()}/${folder}/`);
  directoryList.forEach(collection => {
    if (collection.type === searchedType || searchedType === '') {
      collection.debateTypeName = collection.type;
      collection.debates = [];

      const files = readdirSync(collection.path);
      files.forEach(file => {
        if (file.endsWith('.json')) {
          collection.debates.push(file.replace('.json', ''));
        }
      });
    }
  });

  return directoryList;
}

async function getDynamoDebateListings() {
  return [];
}

module.exports = {
  getRootDir,
  getDebateListings,
  getDynamoDebateListings,
};
