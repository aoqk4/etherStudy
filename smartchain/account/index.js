"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _config = require("../config.js");
var _index = require("../util/index.js");
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
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
var Account = /*#__PURE__*/function () {
  function Account() {
    _classCallCheck(this, Account);
    this.keyPair = _index.ecfun.genKeyPair();
    this.address = this.keyPair.getPublic().encode("hex");

    // 시작 값(화폐?)
    this.balance = _config.STARTING_BALANCE;
  }

  // 데이터에 서명 하는 메소드 호출
  _createClass(Account, [{
    key: "sign",
    value: function sign(data) {
      return this.keyPair.sign((0, _index.keccakHash)(data));
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        address: this.address,
        balance: this.balance
      };
    }

    // 서명 확인
  }], [{
    key: "verifySignature",
    value: function verifySignature(_ref) {
      var publicKey = _ref.publicKey,
        data = _ref.data,
        signature = _ref.signature;
      var keyFromPublic = ec.keyFromPublic(publicKey, "hex");
      return keyFromPublic.verify((0, _index.keccakHash)(data), signature);
    }
  }]);
  return Account;
}();
var _default = Account;
exports["default"] = _default;