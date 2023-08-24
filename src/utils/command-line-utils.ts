import chalk from "chalk";
import ora, { type Ora } from "ora";

class Timer {
  private spinner: Ora;

  private before: number | undefined;

  private currentMessage: string;

  public constructor() {
    this.spinner = ora();
    this.currentMessage = '';
  }

  private get timeTaken() {
    const timeTakenMs = Math.round(performance.now() - this.before!)
    const minTimeTakenMs = 10;
    const timeTakenMsToUse = Math.max(timeTakenMs, minTimeTakenMs);
    const timeTakenSecs = (timeTakenMsToUse / 1_000).toFixed(2);

    return timeTakenSecs;
  }

  public start(message: string) {
    this.currentMessage = message;
    this.before = performance.now();
    this.spinner.start(`${message} ...`);
  }

  public succeed(message?: string) {
    const messageToUse = message ?? this.currentMessage;
    const text = `${messageToUse} (${this.timeTaken}s)`;
    this.spinner.succeed(text);
  }

  public fail(message?: string) {
    const messageToUse = message ?? this.currentMessage;
    const text = `${chalk.red.bold('ERROR:')} ${messageToUse} (${this.timeTaken}s)`;
    this.spinner.fail(text);
  }
}

// Singleton
export const timer = new Timer();
