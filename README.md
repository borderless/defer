# Defer

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Bundle size][bundlephobia-image]][bundlephobia-url]

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

const fn = defer((defer) => {
  defer(() => {
    i++;
    expect(i).toEqual(1);
  });

  expect(i).toEqual(0);
});

await fn(); // `i == 1`.
```

If you're working with synchronous functions, you can use `deferSync` instead.

## License

MIT

[npm-image]: https://img.shields.io/npm/v/@borderless/defer.svg?style=flat
[npm-url]: https://npmjs.org/package/@borderless/defer
[downloads-image]: https://img.shields.io/npm/dm/@borderless/defer.svg?style=flat
[downloads-url]: https://npmjs.org/package/@borderless/defer
[travis-image]: https://img.shields.io/travis/com/borderless/defer.svg?style=flat
[travis-url]: https://travis-ci.com/github/borderless/defer
[coveralls-image]: https://img.shields.io/coveralls/borderless/defer.svg?style=flat
[coveralls-url]: https://coveralls.io/r/borderless/defer?branch=master
[bundlephobia-image]: https://img.shields.io/bundlephobia/minzip/@borderless/defer.svg
[bundlephobia-url]: https://bundlephobia.com/result?p=@borderless/defer
