import { lstatSync, readdirSync } from 'fs';
import { dirname, join } from 'path';

export function getRootDir() {
  return dirname(require.main.filename || process.mainModule.filename);
}

const isDirectory = source => lstatSync(source).isDirectory();

export function getDirectories(source) {
  return readdirSync(source)
    .map(name => join(source, name))
    .filter(isDirectory)
    .map(path => {
      const arr = path.split('/');
      return {
        type: arr[arr.length - 1],
        path
      };
    });
}

export function getDebateListings(folder, searchedType = '') {
  const directoryList = getDirectories(`${getRootDir()}/${folder}/`);
  const newDirectoryList = [];

  directoryList.forEach(collection => {
    const newCollection = collection;
    if (newCollection.type === searchedType || searchedType === '') {
      newCollection.debateTypeName = newCollection.type;
      newCollection.debates = [];

      const files = readdirSync(newCollection.path);
      files.forEach(file => {
        if (file.endsWith('.json')) {
          newCollection.debates.push(file.replace('.json', ''));
        }
      });
    }
    newDirectoryList.push(newCollection);
  });

  return newDirectoryList;
}

export async function getDynamoDebateListings() {
  return [];
}
