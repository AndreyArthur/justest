import assert from 'assert';
import { describe, it } from 'node:test';
import Suite from '../suite';
import Logger from '../logger';

describe('suite', () => {
  it('should create a test suite', () => {
    const suite = new Suite('my suite', new Logger(false));

    assert.ok(suite);
    assert.strictEqual(suite.__data.name, 'my suite');
  });

  it('should add tests to the suite', () => {
    const suite = new Suite('my suite', new Logger(false));

    suite.test('first test', () => { });
    suite.test('second test', () => { });

    assert.strictEqual(suite.__data.tests.length, 2);
    assert.strictEqual(suite.__data.tests[0].message, 'first test');
    assert.strictEqual(suite.__data.tests[1].message, 'second test');
  });

  it('should run all tests in the suite', async () => {
    let value = 0;
    const suite = new Suite('my suite', new Logger(false));
    suite.test('first test', () => { value += 2; });
    suite.test('second test', () => { value -= 1; });

    await suite.execute();

    assert.strictEqual(value, 1);
  });

  it('should run before all the tests in suite', async () => {
    let value = 0;
    const suite = new Suite('my suite', new Logger(false));
    let valueIsOne = value === 1;
    suite.beforeAll(() => {
      value += 1;
    });
    suite.test('first test', () => { valueIsOne = value === 1; });
    suite.test('second test', () => { });

    await suite.execute();

    assert.strictEqual(valueIsOne, true);
  });

  it('should run before each test in suite', async () => {
    let value = 0;
    const suite = new Suite('my suite', new Logger(false));
    let valueIsOne = value === 1;
    let valueIsTwo = value === 2;
    suite.beforeEach(() => {
      value += 1;
    });
    suite.test('first test', () => { valueIsOne = value === 1; });
    suite.test('second test', () => { valueIsTwo = value === 2; });

    await suite.execute();

    assert.strictEqual(valueIsOne, true);
    assert.strictEqual(valueIsTwo, true);
  });

  it('should run after all tests in suite', async () => {
    let value = 0;
    const suite = new Suite('my suite', new Logger(false));
    suite.afterAll(() => {
      value += 1;
    });
    suite.test('first test', () => { });
    suite.test('second test', () => { });

    await suite.execute();

    assert.strictEqual(value, 1);
  });

  it('should run after each test in suite', async () => {
    let value = 0;
    const suite = new Suite('my suite', new Logger(false));
    let valueIsZero = false;
    let valueIsOne = value === 2;
    suite.afterEach(() => {
      value += 1;
    });
    suite.test('first test', () => { valueIsZero = value === 0; });
    suite.test('second test', () => { valueIsOne = value === 1; });

    await suite.execute();

    assert.strictEqual(valueIsZero, true);
    assert.strictEqual(valueIsOne, true);
    assert.strictEqual(value, 2);
  });
});
