import { describe, it, expect } from "vitest";
import { defer, deferSync } from "./index.js";

describe("defer", () => {
  it("should defer a callback", async () => {
    let i = 0;

    const fn = defer(function* () {
      yield () => {
        i++;
        expect(i).toEqual(3);
      };
      expect(i).toEqual(0);

      yield () => {
        i++;
        expect(i).toEqual(2);
      };
      expect(i).toEqual(0);

      i++;
      expect(i).toEqual(1);
    });

    await fn();
    expect(i).toEqual(3);
  });

  it("should propagate reject", async () => {
    let i = 0;

    const fn = defer(function* () {
      yield () => void i++;

      throw new Error("boom");
    });

    expect(i).toEqual(0);
    await expect(fn()).rejects.toEqual(new Error("boom"));
    expect(i).toEqual(1);
  });

  it("should propagate defer error over reject", async () => {
    const fn = defer(function* () {
      yield () => {
        throw new Error("1");
      };

      throw new Error("boom");
    });

    await expect(fn()).rejects.toEqual(new Error("1"));
  });

  it("should propagate defer error", async () => {
    const fn = defer(async function* () {
      yield () => {
        throw new Error("1");
      };

      return true;
    });

    await expect(fn()).rejects.toEqual(new Error("1"));
  });

  it("should propagate last defer error", async () => {
    const fn = defer(function* () {
      yield () => {
        throw new Error("3");
      };

      yield () => {
        throw new Error("2");
      };

      yield () => {
        throw new Error("1");
      };

      return true;
    });

    await expect(fn()).rejects.toEqual(new Error("3"));
  });

  describe("sync", () => {
    it("should defer a callback", () => {
      let i = 0;

      const fn = deferSync(function* () {
        yield () => {
          i++;
          expect(i).toEqual(3);
        };
        expect(i).toEqual(0);

        yield () => {
          i++;
          expect(i).toEqual(2);
        };
        expect(i).toEqual(0);

        i++;
        expect(i).toEqual(1);
      });

      fn();
      expect(i).toEqual(3);
    });

    it("should propagate reject", () => {
      let i = 0;

      const fn = deferSync(function* () {
        yield () => i++;

        throw new Error("boom");
      });

      expect(i).toEqual(0);
      expect(fn).toThrowError("boom");
      expect(i).toEqual(1);
    });

    it("should propagate defer error over reject", () => {
      const fn = deferSync(function* () {
        yield () => {
          throw new Error("1");
        };

        throw new Error("boom");
      });

      expect(fn).toThrowError("1");
    });

    it("should propagate defer error", () => {
      const fn = deferSync(function* () {
        yield () => {
          throw new Error("1");
        };

        return true;
      });

      expect(fn).toThrowError("1");
    });

    it("should propagate last defer error", () => {
      const fn = deferSync(function* () {
        yield () => {
          throw new Error("3");
        };

        yield () => {
          throw new Error("2");
        };

        yield () => {
          throw new Error("1");
        };

        return true;
      });

      expect(fn).toThrowError("3");
    });
  });
});
