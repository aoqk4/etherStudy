"use strict";

var _express = _interopRequireDefault(require("express"));
var _request = _interopRequireDefault(require("request"));
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _block = _interopRequireDefault(require("../blockchain/block"));
// var { _block } = require("../blockchain/block");
var _index = _interopRequireDefault(require("../blockchain/index.js"));
var _index2 = _interopRequireDefault(require("../account/index.js"));
var _pubsub = _interopRequireDefault(require("./pubsub.js"));
var _index3 = _interopRequireDefault(require("../transaction/index.js"));
var _transactionQueue = _interopRequireDefault(
  require("../transaction/transaction-queue.js")
);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule
    ? obj
    : {
        default: obj,
      };
}
var app = (0, _express["default"])();
app.use(_bodyParser["default"].json());
var blockchain = new _index["default"]();
var transactionQueue = new _transactionQueue["default"]();
var pubsub = new _pubsub["default"]({
  blockchain: blockchain,
  transactionQueue: transactionQueue,
});
var account = new _index2["default"]();
var transaction = _index3["default"].createTransaction({
  account: account,
});
setTimeout(function () {
  pubsub.broadcastTransaction(transaction);
}, 500);

// next는 객체를 처리할 수 있는 다음 미들웨어로 객체를 위임한다.
app.get("/blockchain", function (req, res, next) {
  var chain = blockchain.chain;
  res.json({
    chain: chain,
  });
});
app.get("/blockchain/mine", function (req, res, next) {
  var lastBlock = blockchain.chain[blockchain.chain.length - 1];

  var block = _block.mineBlock({
    lastBlock: lastBlock,
    beneficiary: account.address,
    transactionSeries: transactionQueue.getTransactionSeries(),
  });

  blockchain
    .addBlock({
      block: block,
    })
    .then(function () {
      // 블록이 생성되었음을 모두에게 알리기 위해서
      pubsub.broadcastBlock(block);
      res.json({
        block: block,
      });
    })
    ["catch"](next);
});
app.post("/account/transact", function (req, res, next) {
  var _req$body = req.body,
    to = _req$body.to,
    value = _req$body.value;
  var transaction = _index3["default"].createTransaction({
    account: !to ? new _index2["default"]() : account,
    to: to,
    value: value,
  });
  transactionQueue.add(transaction);
  pubsub.broadcastTransaction(transaction);
  res.json({
    transaction: transaction,
  });
});
app.use(function (err, req, res, next) {
  console.log("Internal server error: ", err);
  res.status(500).json({
    message: err.message,
  });
});
var peer = process.argv.includes("--peer");

// 포트를 유동적으로 변화시킨다 프로그램의 실행 여부에 따라서
var PORT = peer ? Math.floor(2000 + Math.random() * 1000) : 3000;

// 블록 동기화를 위해서 서버와 서버가 통신하게 하기 위함
if (peer) {
  (0, _request["default"])(
    "http://localhost:3000/blockchain",
    function (err, res, body) {
      var _JSON$parse = JSON.parse(body),
        chain = _JSON$parse.chain;
      blockchain
        .replaceChain({
          chain: chain,
        })
        .then(function () {
          return console.log("Synchronized with the root node");
        })
        ["catch"](function (err) {
          return console.log("Synchronizaion Error : ", err.message);
        });
    }
  );
}
app.listen(PORT, function () {
  return console.log("Listening at PORT : ".concat(PORT));
});
