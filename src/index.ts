/**
 * A deferrable statement.
 */
export type Deferrable = () => void;

/**
 * The `defer` function.
 */
export type Defer = (fn: Deferrable) => void;

/**
 * Wraps `fn` and adds `defer` as the first argument. Use `defer(() => ...)` to
 * execute code after the function has been resolved or rejected.
 */
export function defer<Args extends unknown[], Return>(
  fn: (defer: Defer, ...args: Args) => Return | PromiseLike<Return>
): (...args: Args) => Promise<Return> {
  return (...args) => {
    const stack: Array<Deferrable> = [];
    const defer = (fn: Deferrable) => void stack.push(fn);

    return new Promise<Return>((resolve) =>
      resolve(fn(defer, ...args))
    ).finally(async () => {
      let result = Promise.resolve();
      while (stack.length) {
        const fn = stack.pop()!;
        result = result.finally(() => fn());
      }
      return result;
    });
  };
}

/**
 * Wraps `fn` and adds `defer` as the first argument. Use `defer(() => ...)` to
 * execute code after the function has returned or thrown.
 */
export function deferSync<Args extends unknown[], Return>(
  fn: (defer: Defer, ...args: Args) => Return
): (...args: Args) => Return {
  return (...args) => {
    const stack: Array<Deferrable> = [];
    const defer = (fn: Deferrable) => void stack.push(fn);

    try {
      return fn(defer, ...args);
    } finally {
      let error: unknown;
      while (stack.length) {
        const fn = stack.pop()!;
        try {
          fn();
        } catch (e) {
          error = e;
        }
      }
      if (error !== undefined) throw error;
    }
  };
}
