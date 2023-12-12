/**
 * An async deferrable statement.
 */
export type Deferrable = () => void | Promise<void>;

/**
 * Wraps `fn` and adds `defer` as the first argument. Use `defer(() => ...)` to
 * execute code after the function has been resolved or rejected.
 */
export function defer<Args extends unknown[], Return>(
  fn: (
    ...args: Args
  ) => AsyncGenerator<Deferrable, Return> | Generator<Deferrable, Return>,
): (...args: Args) => Promise<Return> {
  return async (...args) => {
    const stack: Array<Deferrable> = [];

    try {
      const generator = fn(...args);

      while (true) {
        const result = await generator.next();
        if (result.done) return result.value;
        stack.push(result.value);
      }
    } finally {
      let result = Promise.resolve();
      while (stack.length) {
        const fn = stack.pop()!;
        result = result.finally(() => fn());
      }
      await result;
    }
  };
}

/**
 * A deferrable statement.
 */
export type DeferrableSync = () => void;

/**
 * Wraps `fn` and adds `defer` as the first argument. Use `defer(() => ...)` to
 * execute code after the function has returned or thrown.
 */
export function deferSync<Args extends unknown[], Return>(
  fn: (...args: Args) => Generator<DeferrableSync, Return>,
): (...args: Args) => Return {
  return (...args) => {
    const stack: Array<DeferrableSync> = [];

    try {
      const generator = fn(...args);

      while (true) {
        const result = generator.next();
        if (result.done) return result.value;
        stack.push(result.value);
      }
    } finally {
      let error: unknown = stack;
      while (stack.length) {
        const fn = stack.pop()!;
        try {
          fn();
        } catch (_error) {
          error = _error;
        }
      }
      if (error !== stack) throw error;
    }
  };
}
