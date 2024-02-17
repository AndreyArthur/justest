export default class Logger {
  public active: boolean;

  public static colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
  };

  constructor(active = true) {
    this.active = active;
  }

  public log(message: string, color?: string): void {
    if (!this.active) {
      return;
    }
    if (color) {
      if (message.endsWith('\n')) {
        process.stdout.write(
          `${color}${message.substring(0, message.length - 1)}\x1b[0m\n`,
        );
      } else {
        process.stdout.write(`${color}${message}\x1b[0m`);
      }
      return;
    }
    process.stdout.write(message);
  }

  public error(error: unknown): void {
    if (!this.active) {
      return;
    }
    console.error(error);
  }
}
