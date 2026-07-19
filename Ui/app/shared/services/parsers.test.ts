import { describe, expect, test } from "vitest";
import { parseNumberValue } from "~/shared/services/parsers";

describe("parseNumberValue", () => {
  test("returns a number when given a number as a string", () => {
    expect(parseNumberValue("1", 0)).toBe(1);
    expect(parseNumberValue("12", 0)).toBe(12);
    expect(parseNumberValue("-123", 0)).toBe(-123);
  });

  test("returns previous value when input value is not a number", () => {
    expect(parseNumberValue("a", 0)).toBe(0);
    expect(parseNumberValue("bb", -5)).toBe(-5);
    expect(parseNumberValue("ccc", 14)).toBe(14);
  });

  test("returns null when empty string", () => {
    expect(parseNumberValue("", 0)).toBe(null);
  });
});
