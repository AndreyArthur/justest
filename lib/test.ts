export default class Test {
  public message: string;

  public runs: 'default' | 'only' | 'except';

  public callback: () => void | Promise<void>;

  /**
   * Declares a new test
   *
   * @param message the message of the test
   * @param callback function thwt will be executed when the test runs
   */
  constructor(
    message: string,
    callback: () => void | Promise<void>,
    runs: 'default' | 'only' | 'except' = 'default',
  ) {
    this.message = message;
    this.callback = callback;
    this.runs = runs;
  }

  /**
   * Executes declared test
   *
   * @returns a void promise
   */
  public async execute(): Promise<void> {
    await this.callback();
  }
}
