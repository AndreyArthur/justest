import assert from 'assert';
import { describe, it } from 'node:test';
import Test from '../test';

describe('test', () => {
  it('should create a test', () => {
    const test = new Test('my test', () => { });

    assert.ok(test);
    assert.ok(test.callback);
    assert.strictEqual(test.message, 'my test');
  });

  it('should execute the test callback', async () => {
    let value = 0;
    const test = new Test('my test', () => { value = 1; });

    await test.execute();

    assert.strictEqual(value, 1);
  });
});
