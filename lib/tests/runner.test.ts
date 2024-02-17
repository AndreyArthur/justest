import assert from 'assert';
import { describe, it } from 'node:test';
import Logger from '../logger';
import Runner from '../runner';

describe('runner', () => {
  it('should create a test runner', () => {
    const runner = new Runner(new Logger(false));

    assert.ok(runner);
  });

  it('should add a suite to the runner runner', () => {
    const runner = new Runner(new Logger(false));
    runner.suite('first suite');
    runner.suite('second suite');

    assert.strictEqual(runner.__data.suites.length, 2);
  });

  it('should execute all suites in the runner', async () => {
    let value = 0;
    const runner = new Runner(new Logger(false));
    runner.suite('first suite').test('first test', () => { value += 2; });
    runner.suite('second suite').test('second test', () => { value -= 1; });

    await runner.execute();

    assert.strictEqual(value, 1);
  });
});
