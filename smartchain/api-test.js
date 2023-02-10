"use strict";

var _request = _interopRequireDefault(require("request"));
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
var BASE_URL = "http://localhost:3000";
var postTransact = function postTransact(_ref) {
  var to = _ref.to,
    value = _ref.value;
  return new Promise(function (resolve, reject) {
    (0, _request["default"])("".concat(BASE_URL, "/account/transact"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: to,
        value: value
      })
    }, function (err, res, body) {
      return resolve(JSON.parse(body));
    });
  });
};
var getMine = function getMine() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      (0, _request["default"])("".concat(BASE_URL, "/blockchain/mine"), function (err, res, body) {
        console.log(res.body);
        return resolve(JSON.parse(body));
      });
    }, 1000);
  });
};
postTransact({}).then(function (res) {
  console.log(res);
  var toAccountData = res.transaction.data.accountData;
  return postTransact({
    to: toAccountData,
    value: 20
  });
}).then(function (res2) {
  console.log("postTransactResult2", res2);
  return getMine();
}).then(function (getMineres) {
  console.log("getMineres", getMineres);
});