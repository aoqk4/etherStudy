"use strict";

var _util = require("../util");
var _block = _interopRequireWildcard(require("./block"));
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
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
describe("Block", function () {
  describe("calculateBlockTargetHash()", function () {
    it("calculates the maximum hash when the last block difficulty is 1", function () {
      expect((0, _block.calculateBlockTargetHash)({
        lastBlock: {
          blockHeaders: {
            difficulty: 1
          }
        }
      })).toEqual("f".repeat(64));
    });
    it("calculates a low hash value when the last block difficulty is high", function () {
      expect((0, _block.calculateBlockTargetHash)({
        lastBlock: {
          blockHeaders: {
            difficulty: 500
          }
        }
      }) < "1").toBe(true);
    });
  });
  describe("mineBlock()", function () {
    var lastBlock, minedBlock;
    beforeEach(function () {
      lastBlock = (0, _block.genesis)();
      minedBlock = (0, _block.mineBlock)({
        lastBlock: lastBlock,
        beneficiary: "beneficiary"
      });
    });
    it("mines a block", function () {
      expect(minedBlock).toBeInstanceOf(_block["default"]);
    });
    it("mines a block that meets the proof of work requirement", function () {
      var target = (0, _block.calculateBlockTargetHash)({
        lastBlock: lastBlock
      });
      var _minedBlock = minedBlock,
        blockHeaders = _minedBlock.blockHeaders;
      var nonce = blockHeaders.nonce;
      var truncatedBlockHeaders = _objectSpread({}, blockHeaders);
      delete truncatedBlockHeaders.nonce;
      var header = (0, _util.keccakHash)(truncatedBlockHeaders);
      var underTargetHash = (0, _util.keccakHash)(header + nonce);
      expect(underTargetHash < target).toBe(true);
    });
  });
  describe("adjustDifficulty()", function () {
    it("keeps the difficulty above 0", function () {
      expect((0, _block.adjustDifficulty)({
        lastBlock: {
          blockHeaders: {
            difficulty: 0
          }
        },
        timestamp: Date.now()
      })).toEqual(1);
    });

    // 13초 기준으로 푸는 속도 체크 했다 빠르면 올라가고 느리면 난이도 내려간다.
    it("increases the difficulty for a quickly mined block", function () {
      expect((0, _block.adjustDifficulty)({
        lastBlock: {
          blockHeaders: {
            difficulty: 5,
            timestamp: 1000
          }
        },
        timestamp: 3000
      })).toEqual(6);
    });
    it("decreases the difficulty for a quickly mined block", function () {
      expect((0, _block.adjustDifficulty)({
        lastBlock: {
          blockHeaders: {
            difficulty: 5,
            timestamp: 1000
          }
        },
        timestamp: 20000
      })).toEqual(4);
    });
  });
  describe("validateBlock()", function () {
    var block, lastBlock;
    beforeEach(function () {
      lastBlock = (0, _block.genesis)();
      block = (0, _block.mineBlock)({
        lastBlock: lastBlock,
        beneficiary: "beneficiary"
      });
    });
    it("resolve when the block is genesis block", function () {
      expect((0, _block.validateBlock)({
        block: (0, _block.genesis)()
      })).resolves;
    });
    it("resolve if block is valid", function () {
      expect((0, _block.validateBlock)({
        lastBlock: lastBlock,
        block: block
      })).resolves;
    });
    it("reject when the parentHash is invalid", function () {
      block.blockHeaders.parentHash = "foo";
      expect((0, _block.validateBlock)({
        lastBlock: lastBlock,
        block: block
      })).rejects.toMatchObject({
        message: "The parent hash must be a hash of the last block's headers"
      });
    });
    it("reject when the number is not increased by one", function () {
      block.blockHeaders.number = 31255;
      expect((0, _block.validateBlock)({
        lastBlock: lastBlock,
        block: block
      })).rejects.toMatchObject({
        message: "The block must increment the number by 1"
      });
    });
    it("reject when the difficulty adjust by more than 1", function () {
      block.blockHeaders.difficulty = 23451;
      expect((0, _block.validateBlock)({
        lastBlock: lastBlock,
        block: block
      })).rejects.toMatchObject({
        message: "The difficulty must only adjust by 1"
      });
    });

    // 일반적으로 promise 안에서 돌아가서 테스트도 어렵다.
    // 상황을 강제해서 테스트 -> 함수를 오버라이딩해서 상황을 만든다.
    it("reject when the proof of work requirement is not met", function () {
      var originalCalculateBlockTargetHash = _block.calculateBlockTargetHash;
      _block.calculateBlockTargetHash = (function calculateBlockTargetHash() {
        return "0".repeat(64);
      }, function () {
        throw new Error('"' + "calculateBlockTargetHash" + '" is read-only.');
      }());
      expect((0, _block.validateBlock)({
        lastBlock: lastBlock,
        block: block
      })).rejects.toMatchObject({
        message: "The block not meet the proof of work requirement"
      });
      _block.calculateBlockTargetHash = (originalCalculateBlockTargetHash, function () {
        throw new Error('"' + "calculateBlockTargetHash" + '" is read-only.');
      }());
    });
  });
});