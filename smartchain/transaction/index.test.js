"use strict";

var _index = _interopRequireDefault(require("./index.js"));
var _index2 = _interopRequireDefault(require("../account/index.js"));
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
describe("Transaction", function () {
  var account, standardTransaction, createTransaction;
  beforeEach(function () {
    account = new _index2["default"]();
    standardTransaction = _index["default"].createTransaction({
      account: account,
      to: "foo-recipent",
      value: 50
    });
    createTransaction = _index["default"].createTransaction({
      account: account
    });
  });
  describe("validateStandardTransaction()", function () {
    it("validates a valid transaction", function () {
      expect(_index["default"].validateStandardTransaction({
        transaction: transaction
      })).resolves;
    });
    it("does not validates a valid transaction", function () {
      standardTransaction.to = "different-recipient";
      expect(_index["default"].validateStandardTransaction({
        transaction: transaction
      })).rejects.toMatchObject({
        message: /invalid/
      });
    });
  });
  describe("validateStandardTransaction()", function () {
    it("validates a create account transaction", function () {
      expect(_index["default"].validateCreateAccountTransaction({
        transaction: transaction
      })).resolves;
    });
    it("does not validates a create account transaction", function () {
      expect(_index["default"].standardTransaction({
        transaction: transaction
      })).rejects.toMatchObject({
        message: /incorrect/
      });
    });
  });
});