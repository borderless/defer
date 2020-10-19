import { defer, deferSync } from "./index";

describe("defer", () => {
  it("should defer a callback", async () => {
    let i = 0;

    const fn = defer((defer) => {
      defer(() => {
        i++;
        expect(i).toEqual(3);
      });
      expect(i).toEqual(0);

      defer(() => {
        i++;
        expect(i).toEqual(2);
      });
      expect(i).toEqual(0);

      i++;
      expect(i).toEqual(1);
    });

    await fn();
    expect(i).toEqual(3);
  });

  it("should propagate reject", async () => {
    let i = 0;

    const fn = defer((defer) => {
      defer(() => i++);

      throw new Error("boom");
    });

    expect(i).toEqual(0);
    await expect(fn()).rejects.toEqual(new Error("boom"));
    expect(i).toEqual(1);
  });

  it("should propagate defer error over reject", async () => {
    const fn = defer((defer) => {
      defer(() => {
        throw new Error("1");
      });

      throw new Error("boom");
    });

    await expect(fn()).rejects.toEqual(new Error("1"));
  });

  it("should propagate defer error", async () => {
    const fn = defer((defer) => {
      defer(() => {
        throw new Error("1");
      });

      return true;
    });

    await expect(fn()).rejects.toEqual(new Error("1"));
  });

  it("should propagate last defer error", async () => {
    const fn = defer((defer) => {
      defer(() => {
        throw new Error("3");
      });

      defer(() => {
        throw new Error("2");
      });

      defer(() => {
        throw new Error("1");
      });

      return true;
    });

    await expect(fn()).rejects.toEqual(new Error("3"));
  });

  describe("sync", () => {
    it("should defer a callback", () => {
      let i = 0;

      const fn = deferSync((defer) => {
        defer(() => {
          i++;
          expect(i).toEqual(3);
        });
        expect(i).toEqual(0);

        defer(() => {
          i++;
          expect(i).toEqual(2);
        });
        expect(i).toEqual(0);

        i++;
        expect(i).toEqual(1);
      });

      fn();
      expect(i).toEqual(3);
    });

    it("should propagate reject", () => {
      let i = 0;

      const fn = deferSync((defer) => {
        defer(() => i++);

        throw new Error("boom");
      });

      expect(i).toEqual(0);
      expect(fn).toThrowError("boom");
      expect(i).toEqual(1);
    });

    it("should propagate defer error over reject", () => {
      const fn = deferSync((defer) => {
        defer(() => {
          throw new Error("1");
        });

        throw new Error("boom");
      });

      expect(fn).toThrowError("1");
    });

    it("should propagate defer error", () => {
      const fn = deferSync((defer) => {
        defer(() => {
          throw new Error("1");
        });

        return true;
      });

      expect(fn).toThrowError("1");
    });

    it("should propagate last defer error", () => {
      const fn = deferSync((defer) => {
        defer(() => {
          throw new Error("3");
        });

        defer(() => {
          throw new Error("2");
        });

        defer(() => {
          throw new Error("1");
        });

        return true;
      });

      expect(fn).toThrowError("3");
    });
  });
});
