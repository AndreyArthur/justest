import Logger from './logger';
import Suite from './suite';

export default class Runner {
  public __data: {
    suites: Suite[],
    count: {
      passed: number,
      failed: number,
    }
    logger: Logger,
    beforeAllCallback: () => void | Promise<void>,
    beforeEachCallback: () => void | Promise<void>,
    afterAllCallback: () => void | Promise<void>,
    afterEachCallback: () => void | Promise<void>,
  } = {
      suites: [],
      count: { passed: 0, failed: 0 },
      logger: undefined as unknown as Logger,
      beforeAllCallback: (): void => { },
      beforeEachCallback: (): void => { },
      afterAllCallback: (): void => { },
      afterEachCallback: (): void => { },
    };

  /**
   * Declares a new test runner
   *
   * @param logger the logger instance
   */
  constructor(logger: Logger) {
    this.__data.logger = logger;
  }

  /**
   * Register a callback that will run before all the suites in runner
   *
   * @param callback the callback to be runned
   * @returns void
   */
  public beforeAll(callback: () => void | Promise<void>): void {
    this.__data.beforeAllCallback = callback;
  }

  /**
   * Register a callback that will run before each suite in runner
   *
   * @param callback the callback to be runned
   * @returns void
   */
  public beforeEach(callback: () => void | Promise<void>): void {
    this.__data.beforeEachCallback = callback;
  }

  /**
   * Register a callback that will run after all the suites in runner
   *
   * @param callback the callback to be runned
   * @returns void
   */
  public afterAll(callback: () => void | Promise<void>): void {
    this.__data.afterAllCallback = callback;
  }

  /**
   * Register a callback that will run after each suite in runner
   *
   * @param callback the callback to be runned
   * @returns void
   */
  public afterEach(callback: () => void | Promise<void>): void {
    this.__data.afterEachCallback = callback;
  }

  /**
   * Register a new suite
   *
   * @param name the name of the suite
   * @returns the new suite
   */
  public suite(name: string): Suite {
    const suite = new Suite(name, this.__data.logger);
    this.__data.suites.push(suite);
    return suite;
  }

  /**
   * (Alias of suite) Register a new suite
   *
   * @param name the name of the suite
   * @returns the new suite
   */
  public describe = (name: string): Suite => this.suite(name);

  /**
   * Execute all test suites
   *
   * @returns a void promise
   */
  public async execute(): Promise<void> {
    const start = Date.now();
    await this.__data.beforeAllCallback();
    for (const suite of this.__data.suites) {
      await this.__data.beforeEachCallback();
      await suite.execute();
      this.__data.logger.log('\n');
      await this.__data.afterEachCallback();
    }
    await this.__data.afterAllCallback();
    for (const suite of this.__data.suites) {
      this.__data.count.passed += suite.__data.count.passed;
      this.__data.count.failed += suite.__data.count.failed;
      if (suite.__data.errors.length > 0) {
        process.exitCode = 1;
        for (const error of suite.__data.errors) {
          this.__data.logger.log(
            `${suite.__data.name}: ${error.testMessage}\n`,
            Logger.colors.red,
          );
          this.__data.logger.error(error.object);
          this.__data.logger.log('\n');
        }
      }
    }
    this.__data.logger.log('passed: ');
    this.__data.logger.log(
      `${this.__data.count.passed.toString()}\n`,
      Logger.colors.green,
    );
    this.__data.logger.log('failed: ');
    this.__data.logger.log(
      `${this.__data.count.failed.toString()}\n`,
      Logger.colors.red,
    );
    this.__data.logger.log('time: ');
    this.__data.logger.log(
      `${(Date.now() - start) / 1000}s\n`,
      Logger.colors.yellow,
    );
  }
}
