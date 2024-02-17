# Justest

Justest is a programmatic testing library designed for simplicity and ease of use. It requires no configuration files, uses no hidden dependencies, and does not rely on a specific test command. Focused on providing a straightforward approach to testing, Justest supports TypeScript and JavaScript.

## Features

- **Programmatic API**: Write your tests programmatically, with full control over execution.
- **Minimal Dependencies**: Justest keeps its footprint small, ensuring your project remains lightweight.

## Installation

Justest is easy to install and comes with built-in TypeScript types for a seamless development experience.

```bash
npm install justest
```

## Usage

### Single File

You can quickly get started with Justest in a single file. Here's an example using TypeScript:

```typescript
import assert from 'assert';
import justest from 'justest';

const runner = justest.runner();
const suite = runner.describe('math');

suite.it('should add two numbers', () => {
  const result = 1 + 1;
  assert.strictEqual(result, 2);
});

suite.it('should subtract two numbers', () => {
  const result = 1 - 1;
  assert.strictEqual(result, 0);
});

runner.execute();
```

Execute your tests using `tsc` and `node`, or directly with `ts-node`:

```sh
$ npx tsc && node ./path/to/my_test_file.js
```

Or:

```sh
$ npx ts-node ./path/to/my_test_file.ts
```

You should see the output indicating your tests have passed.

### Multiple Files

For larger projects, you can organize your tests across multiple files.

1. **Create a Runner File** (`runner.ts`):

    ```typescript
    import justest from 'justest';

    export const runner = justest.runner();
    ```

2. **Write Your Test Files** (e.g., `math.spec.ts`):

    ```typescript
    import { runner } from './runner';

    const suite = runner.describe('math');
    suite.it('should add two numbers', () => {/* test code */});
    suite.it('should subtract two numbers', () => {/* test code */});
    ```

3. **Execute Tests** (`run.ts`):

    ```typescript
    import justest from 'justest';
    import { runner } from './runner';

    const test = async (): Promise<void> => {
      const files = justest.helpers.files(
        __dirname,
        (file) => !!file.match(/^.*\/tests\/.*.spec.(js|ts)$/),
      );

      for (const file of files) {
        await import(file);
      }

      await runner.execute();
    };

    test();
    ```

## License

Justest is [MIT licensed](./LICENSE). Feel free to use, modify, and distribute it as part of your projects.

## Support

If you encounter any issues or have questions about using Justest, please file an issue on our GitHub repository.
