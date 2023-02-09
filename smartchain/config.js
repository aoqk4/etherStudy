"use strict";

var GENESIS_DATA = {
  blockHeaders: {
    parentHash: "--genesis-parent-hash--",
    beneficiary: "--genesis-beneficiary--",
    difficulty: 1,
    number: 0,
    timestamp: "--genesis-timestamp--",
    nonce: 0,
    transactionsRoot: "--genesis-transactions-root-"
  },
  transactionSeries: []
};
var MILLISECONDS = 1;
var SECONDS = 1000 * MILLISECONDS;
var STARTING_BALANCE = 1000;

// 속도 기준을 13초로 한다.
var MINE_RATE = 13 * SECONDS;
module.exports = {
  GENESIS_DATA: GENESIS_DATA,
  MINE_RATE: MINE_RATE,
  STARTING_BALANCE: STARTING_BALANCE
};