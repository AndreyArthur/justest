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

  it('should run before all suites in the runner', async () => {
    let value = 0;
    const runner = new Runner(new Logger(false));
    let valueIsOne = value === 1;
    runner.beforeAll(() => {
      value += 1;
    });
    runner.suite('first suite').test('first test', () => {
      valueIsOne = value === 1;
    });
    runner.suite('second suite').test('second test', () => {
      valueIsOne = value === 1;
    });

    await runner.execute();

    assert.strictEqual(valueIsOne, true);
  });

  it('should run before each suite in the runner', async () => {
    let value = 0;
    const runner = new Runner(new Logger(false));
    runner.beforeEach(() => {
      value += 1;
    });
    runner.suite('first suite').test('first test', () => { });
    runner.suite('second suite').test('second test', () => { });

    await runner.execute();

    assert.strictEqual(value, 2);
  });

  it('should run after all suites in the runner', async () => {
    let value = 0;
    const runner = new Runner(new Logger(false));
    let valueWasZero = false;
    runner.afterAll(() => {
      value += 1;
    });
    runner.suite('first suite').test('first test', () => { });
    runner.suite('second suite').test('second test', () => {
      valueWasZero = value === 0;
    });

    await runner.execute();

    assert.strictEqual(value, 1);
    assert.strictEqual(valueWasZero, true);
  });

  it('should run after each suite in the runner', async () => {
    let value = 0;
    const runner = new Runner(new Logger(false));
    let valueWasZero = false;
    let valueWasOne = false;
    runner.afterEach(() => {
      value += 1;
    });
    runner.suite('first suite').test('first test', () => {
      valueWasZero = value === 0;
    });
    runner.suite('second suite').test('second test', () => {
      valueWasOne = value === 1;
    });

    await runner.execute();

    assert.strictEqual(value, 2);
    assert.strictEqual(valueWasOne, true);
    assert.strictEqual(valueWasZero, true);
  });
});
