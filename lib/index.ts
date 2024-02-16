import fs from 'fs';
import path from 'path';

const GREEN = '\x1b[32m%s\x1b[0m';
const RED = '\x1b[31m%s\x1b[0m';
const YELLOW = '\x1b[33m%s\x1b[0m';

class Test {
  public message: string;

  public callback: () => void | Promise<void>;

  constructor(message: string, callback: () => void | Promise<void>) {
    this.message = message;
    this.callback = callback;
  }

  public async execute(): Promise<void> {
    await this.callback();
  }
}

class Suite {
  public __data: {
    name: string,
    tests: Test[],
    count: {
      passed: number,
      failed: number,
    },
    errors: {
      testMessage: string,
      object: unknown,
    }[],
    beforeAllCallback: () => void | Promise<void>,
    beforeEachCallback: () => void | Promise<void>,
    afterAllCallback: () => void | Promise<void>,
    afterEachCallback: () => void | Promise<void>,
  } = {
      name: '',
      tests: [],
      count: { passed: 0, failed: 0 },
      errors: [],
      beforeAllCallback: (): void => { },
      beforeEachCallback: (): void => { },
      afterAllCallback: (): void => { },
      afterEachCallback: (): void => { },
    };

  constructor(name: string) {
    this.__data.name = name;
  }

  public beforeAll(callback: () => void | Promise<void>): void {
    this.__data.beforeAllCallback = callback;
  }

  public beforeEach(callback: () => void | Promise<void>): void {
    this.__data.beforeEachCallback = callback;
  }

  public afterAll(callback: () => void | Promise<void>): void {
    this.__data.afterAllCallback = callback;
  }

  public afterEach(callback: () => void | Promise<void>): void {
    this.__data.afterEachCallback = callback;
  }

  public test(message: string, callback: () => void | Promise<void>): void {
    const test = new Test(message, callback);
    this.__data.tests.push(test);
  }

  public it = (
    message: string,
    callback: () => void | Promise<void>,
  ): void => this.test(message, callback);

  public async execute(): Promise<void> {
    console.log(this.__data.name);
    await this.__data.beforeAllCallback();
    for (const test of this.__data.tests) {
      await this.__data.beforeEachCallback();
      try {
        await test.execute();
        console.log(GREEN, '    ✓ passed', `${test.message}`);
        this.__data.count.passed += 1;
      } catch (err) {
        this.__data.errors.push({ testMessage: test.message, object: err });
        console.log(RED, '    ✗ failed', `${test.message}`);
        this.__data.count.failed += 1;
      }
      await this.__data.afterEachCallback();
    }
    await this.__data.afterAllCallback();
  }
}

class Runner {
  public __data: {
    suites: Suite[],
    count: {
      passed: number,
      failed: number,
    }
  } = {
      suites: [],
      count: { passed: 0, failed: 0 },
    };

  public suite(name: string): Suite {
    const suite = new Suite(name);
    this.__data.suites.push(suite);
    return suite;
  }

  public describe = (name: string): Suite => this.suite(name);

  public async execute(): Promise<void> {
    const start = Date.now();
    for (const suite of this.__data.suites) {
      await suite.execute();
      console.log('');
    }
    for (const suite of this.__data.suites) {
      this.__data.count.passed += suite.__data.count.passed;
      this.__data.count.failed += suite.__data.count.failed;
      if (suite.__data.errors.length > 0) {
        for (const error of suite.__data.errors) {
          console.log(RED, `${suite.__data.name}: ${error.testMessage}`);
          console.error(error.object);
          console.log('');
        }
      }
    }
    process.stdout.write('passed: ');
    console.log(GREEN, this.__data.count.passed.toString());
    process.stdout.write('failed: ');
    console.log(RED, this.__data.count.failed.toString());
    process.stdout.write('time: ');
    console.log(YELLOW, `${(Date.now() - start) / 1000}s`);
  }
}

const justest = {
  runner: (): Runner => new Runner(),
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

export default justest;
