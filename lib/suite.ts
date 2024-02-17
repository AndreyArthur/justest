import Logger from './logger';
import Test from './test';

export default class Suite {
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
    logger: Logger,
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
      logger: undefined as unknown as Logger,
    };

  constructor(name: string, logger: Logger) {
    this.__data.name = name;
    this.__data.logger = logger;
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
    this.__data.logger.log(`${this.__data.name}\n`);
    await this.__data.beforeAllCallback();
    for (const test of this.__data.tests) {
      await this.__data.beforeEachCallback();
      try {
        await test.execute();
        this.__data.logger.log('    ✓ passed ', Logger.colors.green);
        this.__data.logger.log(`${test.message}\n`);
        this.__data.count.passed += 1;
      } catch (err) {
        this.__data.errors.push({ testMessage: test.message, object: err });
        this.__data.logger.log('    ✗ failed ', Logger.colors.red);
        this.__data.logger.log(`${test.message}\n`);
        this.__data.count.failed += 1;
      }
      await this.__data.afterEachCallback();
    }
    await this.__data.afterAllCallback();
  }
}
