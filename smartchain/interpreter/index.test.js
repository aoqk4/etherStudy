"use strict";

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}
var _index = _interopRequireWildcard(require("./index"));
function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj["default"] = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}
var STOP = _index.ONCODE_MAP.STOP,
  ADD = _index.ONCODE_MAP.ADD,
  SUB = _index.ONCODE_MAP.SUB,
  MUL = _index.ONCODE_MAP.MUL,
  DIV = _index.ONCODE_MAP.DIV,
  PUSH = _index.ONCODE_MAP.PUSH,
  LT = _index.ONCODE_MAP.LT,
  GT = _index.ONCODE_MAP.GT,
  EQ = _index.ONCODE_MAP.EQ,
  AND = _index.ONCODE_MAP.AND,
  OR = _index.ONCODE_MAP.OR,
  JUMP = _index.ONCODE_MAP.JUMP,
  JUMPI = _index.ONCODE_MAP.JUMPI;
describe("Interpreter", function () {
  describe("runCode()", function () {
    describe("and the code inludes ADD", function () {
      it("adds two values", function () {
        expect(new _index["default"]().runCode([PUSH, 2, PUSH, 3, ADD, STOP])).toEqual(5);
      });
    });
    describe("and the code inludes SUB", function () {
      it("subtracts one value from another", function () {
        expect(new _index["default"]().runCode([PUSH, 2, PUSH, 3, SUB, STOP])).toEqual(1);
      });
    });
    describe("and the code inludes MUL", function () {
      it("prodcuts two values", function () {
        expect(new _index["default"]().runCode([PUSH, 2, PUSH, 3, MUL, STOP])).toEqual(6);
      });
    });
    describe("and the code inludes DIV", function () {
      it("divide one value from another", function () {
        expect(new _index["default"]().runCode([PUSH, 2, PUSH, 3, DIV, STOP])).toEqual(1.5);
      });
    });
    describe("and the code inludes LT", function () {
      it("checks if one value is less than another", function () {
        expect(new _index["default"]().runCode([PUSH, 2, PUSH, 3, LT, STOP])).toEqual(0);
      });
    });
    describe("and the code inludes GT", function () {
      it("checks if one value is great than another", function () {
        expect(new _index["default"]().runCode([PUSH, 2, PUSH, 3, GT, STOP])).toEqual(1);
      });
    });
    describe("and the code inludes EQ", function () {
      it("checks if one value is equal than another", function () {
        expect(new _index["default"]().runCode([PUSH, 2, PUSH, 3, EQ, STOP])).toEqual(0);
      });
    });
    describe("and the code inludes AND", function () {
      it("ands two conditions", function () {
        expect(new _index["default"]().runCode([PUSH, 1, PUSH, 0, EQ, STOP])).toEqual(0);
      });
    });
    describe("and the code inludes OR", function () {
      it("ors two conditions", function () {
        expect(new _index["default"]().runCode([PUSH, 1, PUSH, 0, OR, STOP])).toEqual(1);
      });
    });
    describe("and the code inludes JUMP", function () {
      it("jumps to a destination", function () {
        expect(new _index["default"]().runCode([PUSH, 6, JUMP, PUSH, 0, JUMP, PUSH, "jump sucessful", STOP])).toEqual("jump sucessful");
      });
    });
    describe("and the code inludes JUMP I", function () {
      it("jumps to a destination", function () {
        expect(new _index["default"]().runCode([PUSH, 8, PUSH, 1, JUMPI, PUSH, 0, JUMPI, PUSH, "jump sucessful", STOP])).toEqual("jump sucessful");
      });
    });

    // try catch를 잡을 경우에는 그 하나의 에러 테스트를 콜백으로 묶는다.
    describe("and the code inludes an invalid JUMP destination", function () {
      it("throws an error", function () {
        expect(function () {
          return new _index["default"]().runCode([PUSH, 99, JUMP, PUSH, 0, JUMP, PUSH, "jump sucessful", STOP]);
        }).toThrow("Invalid destination: 99");
      });
    });
    describe("and the code inludes an invalid PUSH destination", function () {
      it("throws an error", function () {
        expect(function () {
          return new _index["default"]().runCode([PUSH, 0, PUSH]);
        }).toThrow("The PUSH instruction cannot be last.");
      });
    });
    describe("and the code inludes an infinite loo[", function () {
      it("throws an error", function () {
        expect(function () {
          return new _index["default"]().runCode([PUSH, 0, JUMP, STOP]);
        }).toThrow("Check for an infinite loop. Execution limit of 10000");
      });
    });
  });
});