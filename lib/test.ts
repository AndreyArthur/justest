export default class Test {
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
