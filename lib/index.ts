import fs from 'fs';
import path from 'path';
import Runner from './runner';
import Logger from './logger';

const justest = {
  runner: (): Runner => new Runner(new Logger()),
  helpers: {
    files(
      baseDirectory: string,
      conditionCallback: (file: string) => boolean,
    ): string[] {
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
    },
  },
};

export = justest;
