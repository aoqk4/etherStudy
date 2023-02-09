"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _dotenv = _interopRequireDefault(require("dotenv"));
var _pubnub = _interopRequireDefault(require("pubnub"));
var _index = _interopRequireDefault(require("../transaction/index.js"));
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
_dotenv["default"].config();
var credentials = {
  publishKey: process.env.PUBLISH_KEY,
  subscribeKey: process.env.SUBSCRIBE_KEY,
  secretKey: process.env.SECRET_KEY,
  userId: "ljs"
};
var CHANNELS_MAP = {
  TEST: "TEST",
  BLOCK: "BLOCK",
  TRANSACTION: "TRANSACTION"
};
var PubSub = /*#__PURE__*/function () {
  function PubSub(_ref) {
    var blockchain = _ref.blockchain,
      transactionQueue = _ref.transactionQueue;
    _classCallCheck(this, PubSub);
    this.pubnub = new _pubnub["default"](credentials);
    this.blockchain = blockchain;
    this.transactionQueue = transactionQueue;
    this.subscribeToChannels();
    this.listen();
  }
  _createClass(PubSub, [{
    key: "subscribeToChannels",
    value: function subscribeToChannels() {
      this.pubnub.subscribe({
        channels: Object.values(CHANNELS_MAP)
      });
    }
  }, {
    key: "publish",
    value: function publish(_ref2) {
      var channel = _ref2.channel,
        message = _ref2.message;
      this.pubnub.publish({
        channel: channel,
        message: message
      });
    }
  }, {
    key: "listen",
    value: function listen() {
      var _this = this;
      this.pubnub.addListener({
        message: function message(messageObject) {
          var channel = messageObject.channel,
            message = messageObject.message;
          var parsedMessage = JSON.parse(message);
          console.log("Message received. Channel:", channel);
          switch (channel) {
            case CHANNELS_MAP.BLOCK:
              console.log("block message", message);
              _this.blockchain.addBlock({
                block: parsedMessage,
                transactionQueue: _this.transactionQueue
              }).then(function () {
                return console.log("New Block accepted", parsedMessage);
              })["catch"](function (err) {
                return console.log("New Block rejected", err.message);
              });
              break;
            case CHANNELS_MAP.TRANSACTION:
              console.log("Received transaction : ".concat(parsedMessage.id));
              _this.transactionQueue.add(new _index["default"](parsedMessage));
              break;
            default:
              return;
          }
        }
      });
    }
  }, {
    key: "broadcastBlock",
    value: function broadcastBlock(block) {
      this.publish({
        channel: CHANNELS_MAP.BLOCK,
        message: JSON.stringify(block)
      });
    }
  }, {
    key: "broadcastTransaction",
    value: function broadcastTransaction(transaction) {
      this.publish({
        channel: CHANNELS_MAP.TRANSACTION,
        message: JSON.stringify(transaction)
      });
    }
  }]);
  return PubSub;
}();
var _default = PubSub;
exports["default"] = _default;