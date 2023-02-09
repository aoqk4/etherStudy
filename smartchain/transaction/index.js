"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _uuid = require("uuid");
var _index = _interopRequireDefault(require("../account/index.js"));
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
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
var TRNASACTION_TYPE_MAP = {
  CREATE_ACCOUNT: "CREATE_ACCOUNT",
  TRANSACT: "TRANSACT"
};
var Transaction = /*#__PURE__*/function () {
  function Transaction(_ref) {
    var id = _ref.id,
      from = _ref.from,
      to = _ref.to,
      value = _ref.value,
      data = _ref.data,
      signature = _ref.signature;
    _classCallCheck(this, Transaction);
    this.id = id || (0, _uuid.v4)();
    this.from = from || "-";
    this.to = to || "-";
    this.value = value || 0;
    this.data = data || "-";
    this.signature = signature || "-";
  }
  _createClass(Transaction, null, [{
    key: "createTransaction",
    value: function createTransaction(_ref2) {
      var account = _ref2.account,
        to = _ref2.to,
        value = _ref2.value;
      // 보내는 사람이 있으면 거래, 아니면 계정 생성?
      if (to) {
        var transactionData = {
          id: (0, _uuid.v4)(),
          from: account.address,
          to: to,
          value: value,
          data: {
            type: TRNASACTION_TYPE_MAP.TRANSACT
          }
        };
        return new Transaction(_objectSpread(_objectSpread({}, transactionData), {}, {
          signature: account.sign(transactionData)
        }));
      }
      return new Transaction({
        data: {
          type: TRNASACTION_TYPE_MAP.CREATE_ACCOUNT,
          accountData: account.toJSON()
        }
      });
    }
  }, {
    key: "validateStandardTransaction",
    value: function validateStandardTransaction(_ref3) {
      var trnasaction = _ref3.trnasaction;
      return new Promise(function (resolve, reject) {
        var from = trnasaction.from,
          signature = trnasaction.signature;
        var transactionData = _objectSpread({}, trnasaction);
        delete transactionData.signature;
        if (!_index["default"].verifySignature({
          publicKey: from,
          data: transactionData,
          signature: signature
        })) {
          return reject(new Error("Transaction: ".concat(id, " signature is invalid")));
        }
        return resolve();
      });
    }
  }, {
    key: "validateCreateAccountTransaction",
    value: function validateCreateAccountTransaction(_ref4) {
      var transaction = _ref4.transaction;
      return new Promise(function (resolve, reject) {
        var expectedAccountDataFields = Object.keys(new _index["default"]().toJSON());
        var fields = Object.keys(transaction.data.accountData);
        if (fields.length !== expectedAccountDataFields) {
          return reject(new Error("The transaction account data has an incorrectt number of fields"));
        }
        fields.forEach(function (field) {
          if (!expectedAccountDataFields.includes(field)) {
            return reject(new Error("\n          The field: ".concat(field, " is expected for account data")));
          }
        });
        return resolve();
      });
    }
  }]);
  return Transaction;
}();
var _default = Transaction;
exports["default"] = _default;