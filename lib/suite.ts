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
    hasTestsThatRunsOnly: boolean,
  } = {
      hasTestsThatRunsOnly: false,
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

  /**
   * Declares a new test suite
   *
   * @param name name of the suite
   * @param logger the logger instance
   */
  constructor(name: string, logger: Logger) {
    this.__data.name = name;
    this.__data.logger = logger;
  }

  /**
   * Register a callback that will run before all the tests in suite
   *
   * @param callback the callback to be runned
   * @returns void
   */
  public beforeAll(callback: () => void | Promise<void>): void {
    this.__data.beforeAllCallback = callback;
  }

  /**
   * Register a callback that will run before each test in suite
   *
   * @param callback the callback to be runned
   * @returns void
   */
  public beforeEach(callback: () => void | Promise<void>): void {
    this.__data.beforeEachCallback = callback;
  }

  /**
   * Register a callback that will run after all the tests in suite
   *
   * @param callback the callback to be runned
   * @returns void
   */
  public afterAll(callback: () => void | Promise<void>): void {
    this.__data.afterAllCallback = callback;
  }

  /**
   * Register a callback that will run after each test in suite
   *
   * @param callback the callback to be runned
   * @returns void
   */
  public afterEach(callback: () => void | Promise<void>): void {
    this.__data.afterEachCallback = callback;
  }

  /**
   * Register a new test into the suite
   *
   * @param message the message of the test
   * @param callback function that will be executed when the test runs
   * @returns void
   */
  public test(message: string, callback: () => void | Promise<void>): void {
    const test = new Test(message, callback);
    this.__data.tests.push(test);
  }

  /**
   * Register a new test to run alone
   *
   * @param message the message of the test
   * @param callback function that will be executed when the test runs
   * @returns void
   */
  public testOnly(message: string, callback: () => void | Promise<void>): void {
    const test = new Test(message, callback, 'only');
    this.__data.hasTestsThatRunsOnly = true;
    this.__data.tests.push(test);
  }

  /**
   * Register a new test that do not runs
   *
   * @param message the message of the test
   * @param callback function that will be executed when the test runs
   * @returns void
   */
  public testExcept(
    message: string,
    callback: () => void | Promise<void>,
  ): void {
    const test = new Test(message, callback, 'except');
    this.__data.tests.push(test);
  }

  /**
   * (Alias of test) Register a new test into the suite
   *
   * @param message the message of the test
   * @param callback function that will be executed when the test runs
   * @returns void
   */
  public it = (
    message: string,
    callback: () => void | Promise<void>,
  ): void => this.test(message, callback);

  /**
   * Execute all tests in the suite
   *
   * @returns a void promise
   */
  public async execute(): Promise<void> {
    this.__data.logger.log(`${this.__data.name}\n`);
    await this.__data.beforeAllCallback();
    let tests;
    if (this.__data.hasTestsThatRunsOnly) {
      tests = [this.__data.tests.find((test) => test.runs === 'only') as Test];
    } else {
      tests = this.__data.tests;
    }
    for (const test of tests) {
      if (test.runs === 'except') {
        continue;
      }
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
