export default class Test {
  public message: string;

  public callback: () => void | Promise<void>;

  /**
   * Declares a new test
   *
   * @param message the message of the test
   * @param callback function thwt will be executed when the test runs
   */
  constructor(message: string, callback: () => void | Promise<void>) {
    this.message = message;
    this.callback = callback;
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
