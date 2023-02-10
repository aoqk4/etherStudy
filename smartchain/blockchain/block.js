"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _config = require("../config");
var _index = require("../util");
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
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
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
var HASH_LENGTH = 64;
var MAX_HASH_VALUE = parseInt("f".repeat(HASH_LENGTH), 16);
var MAX_NONCE_VALUE = Math.pow(2, 64);
var Block = /*#__PURE__*/function () {
  function Block(_ref) {
    var blockHeaders = _ref.blockHeaders,
      transactionSeries = _ref.transactionSeries;
    _classCallCheck(this, Block);
    this.blockHeaders = blockHeaders;
    this.transactionSeries = transactionSeries;
  }
  _createClass(Block, null, [{
    key: "calculateBlockTargetHash",
    value: function calculateBlockTargetHash(_ref2) {
      var lastBlock = _ref2.lastBlock;
      var value = (MAX_HASH_VALUE / lastBlock.blockHeaders.difficulty).toString(16);
      if (value.length > HASH_LENGTH) {
        return "f".repeat(HASH_LENGTH);
      }
      return "0".repeat(HASH_LENGTH - value.length) + value;
    }
  }, {
    key: "adjustDifficulty",
    value: function adjustDifficulty(_ref3) {
      var lastBlock = _ref3.lastBlock,
        timestamp = _ref3.timestamp;
      var difficulty = lastBlock.blockHeaders.difficulty;
      if (timestamp - lastBlock.blockHeaders.timestamp > _config.MINE_RATE) {
        return difficulty - 1;
      }
      if (difficulty < 1) {
        return 1;
      }
      return difficulty + 1;
    }

    // 전 블록들이 이어져 있어서 블록을 캘 때는 전 블록을 이용해야 한다.
    // 그럼 빈 배열일때 마지막 블록은? -> 제네시스 블록 이용한다.
  }, {
    key: "mineBlock",
    value: function mineBlock(_ref4) {
      var lastBlock = _ref4.lastBlock,
        beneficiary = _ref4.beneficiary,
        transactionSeries = _ref4.transactionSeries;
      var target = Block.calculateBlockTargetHash({
        lastBlock: lastBlock
      });
      var timestamp, truncatedBlockHeaders, header, nonce, underTargetHash;

      // 만족값을 찾아내는 헤더의 nonce를 찾아내는게 블록체인 채굴의 핵심이다..
      // 왜? 다른건 이미 정해져 있고, nonce값만 일정하지 않으니깐.
      // 현 경우에는 이전 해시보다 작은 해시를 찾아서 시드를 미친듯이 돌려야한다..
      do {
        timestamp = Date.now();
        truncatedBlockHeaders = {
          parentHash: (0, _index.keccakHash)(lastBlock.blockHeaders),
          beneficiary: beneficiary,
          difficulty: Block.adjustDifficulty({
            lastBlock: lastBlock,
            timestamp: timestamp
          }),
          number: lastBlock.blockHeaders.number + 1,
          timestamp: timestamp,
          // the transactionRoot will be refactored once Tries are impl.
          transactionsRoot: (0, _index.keccakHash)(transactionSeries)
        };
        header = (0, _index.keccakHash)(truncatedBlockHeaders);
        nonce = Math.floor(Math.random() * MAX_NONCE_VALUE);
        underTargetHash = (0, _index.keccakHash)(header + nonce);
      } while (underTargetHash > target);

      // timestamp = Date.now();
      // truncatedBlockHeaders = {
      //   parentHash: keccakHash(lastBlock.blockHeaders),
      //   beneficiary,
      //   difficulty: lastBlock.blockHeaders.difficulty + 1,
      //   number: lastBlock.blockHeaders.number + 1,
      //   timestamp,
      // };

      // header = keccakHash(truncatedBlockHeaders);
      // nonce = Math.floor(Math.random() * MAX_NONCE_VALUE);

      // const underTargetHash = keccakHash(header + nonce);

      return new this({
        blockHeaders: _objectSpread(_objectSpread({}, truncatedBlockHeaders), {}, {
          nonce: nonce
        }),
        transactionSeries: transactionSeries
      });
    }
  }, {
    key: "genesis",
    value: function genesis() {
      return new Block(_config.GENESIS_DATA);
    }

    // 올바른 블록이 전달되고 있는지 확인하는 함수
  }, {
    key: "validateBlock",
    value: function validateBlock(_ref5) {
      var lastBlock = _ref5.lastBlock,
        block = _ref5.block;
      return new Promise(function (resolve, reject) {
        // genesis block은 해시로 검사한다.

        if ((0, _index.keccakHash)(block) === (0, _index.keccakHash)(Block.genesis())) {
          return resolve();
        }
        if ((0, _index.keccakHash)(lastBlock.blockHeaders) !== block.blockHeaders.parentHash) {
          return reject(new Error("The parent hash must be a hash of the last block's headers"));
        }
        if (block.blockHeaders.number !== lastBlock.blockHeaders.number + 1) {
          return reject(new Error("The block must increment the number by 1"));
        }
        if (Math.abs(lastBlock.blockHeaders.difficulty - block.blockHeaders.difficulty) > 1) {
          return reject(new Error("The difficulty must only adjust by 1"));
        }
        var target = Block.calculateBlockTargetHash({
          lastBlock: lastBlock
        });
        var blockHeaders = block.blockHeaders;
        var nonce = blockHeaders.nonce;
        var truncatedBlockHeaders = _objectSpread({}, blockHeaders);
        delete truncatedBlockHeaders.nonce;
        var header = (0, _index.keccakHash)(truncatedBlockHeaders);
        var underTargetHash = (0, _index.keccakHash)(header + nonce);
        if (underTargetHash > target) {
          return reject(new Error("The block not meet the proof of work requirement"));
        }
        return resolve();
      });
    }
  }]);
  return Block;
}();
module.exports = Block;