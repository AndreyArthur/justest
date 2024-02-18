import Logger from './logger';
import Suite from './suite';

export default class Runner {
  public __data: {
    suites: Suite[],
    count: {
      passed: number,
      failed: number,
    }
    logger: Logger
  } = {
      suites: [],
      count: { passed: 0, failed: 0 },
      logger: undefined as unknown as Logger,
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
    for (const suite of this.__data.suites) {
      await suite.execute();
      this.__data.logger.log('\n');
    }
    for (const suite of this.__data.suites) {
      this.__data.count.passed += suite.__data.count.passed;
      this.__data.count.failed += suite.__data.count.failed;
      if (suite.__data.errors.length > 0) {
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
