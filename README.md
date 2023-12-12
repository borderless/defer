# Defer

> Tiny, type-safe, JavaScript-native `defer` implementation.

**Why?** It's helpful to have statements that can automatically execute when a function has completed. For example, to `close` a file descriptor or clear state.

## Installation

```sh
npm install @borderless/defer --save
```

## Usage

```ts
import { defer, deferSync } from "@borderless/defer";

let i = 0;

const fn = defer(async function* () {
  const result = await doSomethingAsync();

  yield () => {
    i++;
    expect(i).toEqual(1);
  };

  expect(i).toEqual(0);

  return result;
});

await fn(); // `i == 1`.
```

If you're working with synchronous functions, you can use `deferSync` instead.

## License

MIT
