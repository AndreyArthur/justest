import fs from 'fs';
import path from 'path';
import Runner from './runner';
import Logger from './logger';

/**
 * Declares a new test runner
 *
 * @returns a runner instance
 */
const runner = (): Runner => new Runner(new Logger());

/**
 * Gets all files in a directory, filtered by a condition
 *
 * @param baseDirectory the base search directory
 * @param conditionCallback a filter callback for searched files
 */
const files = (
  baseDirectory: string,
  conditionCallback: (file: string) => boolean,
): string[] => {
  const recursive = (directory: string): string[] => {
    let filesList: string[] = [];
    const items: string[] = fs.readdirSync(directory);
    items.forEach((item) => {
      const itemPath: string = path.join(directory, item);
      if (fs.statSync(itemPath).isDirectory()) {
        filesList = filesList.concat(recursive(itemPath));
      } else {
        filesList.push(itemPath);
      }
    });
    return filesList;
  };
  const filesInDirectory: string[] = recursive(baseDirectory);
  return filesInDirectory.filter(conditionCallback);
};

const justest = {
  runner,
  helpers: {
    files,
  },
};

export = justest;
