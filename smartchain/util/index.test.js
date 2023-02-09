"use strict";

var _require = require("./index"),
  sortCharacters = _require.sortCharacters,
  keccakHash = _require.keccakHash;
describe("util", function () {
  describe("sortCharacters()", function () {
    it("creates the same string for objects with same propreties in a different order", function () {
      expect(sortCharacters({
        foo: "foo",
        bar: "bar"
      })).toEqual(sortCharacters({
        bar: "bar",
        foo: "foo"
      }));
    });
    it("creates the different string for different obj", function () {
      expect(sortCharacters({
        foo: "foo"
      })).not.toEqual(sortCharacters({
        bar: "bar"
      }));
    });
  });
  describe("keccakHash()", function () {
    it("produces a keccak256 Hash", function () {
      expect(keccakHash("foo")).toEqual("b2a7ad9b4a2ee6d984cc5c2ad81d0c2b2902fa410670aa3f2f4f668a1f80611c");
    });
  });
});