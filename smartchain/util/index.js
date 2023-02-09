"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortCharacters = exports.keccakHash = exports.ecfun = void 0;
var _elliptic = _interopRequireDefault(require("elliptic"));
var _jsSha = _interopRequireDefault(require("js-sha3"));
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
var EC = _elliptic["default"].ec;
var keccak256 = _jsSha["default"].keccak256;

// 암호화를 위한 객체 생성
var ecfun = new EC("secp256k1");

// 순서와 관계없이 주어진 객체에 대해서 일관된 문자열을 반환한다.
exports.ecfun = ecfun;
var sortCharacters = function sortCharacters(data) {
  return JSON.stringify(data).split("").sort().join("");
};
exports.sortCharacters = sortCharacters;
var keccakHash = function keccakHash(data) {
  var hash = keccak256.create();

  // 동일한 객체에 대해서 동일한 해시를 생성하기 위함
  hash.update(sortCharacters(data));
  return hash.hex();
};
exports.keccakHash = keccakHash;