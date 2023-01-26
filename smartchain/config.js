const GENESIS_DATA = {
  blockHeaders: {
    parentHash: "--genesis-parent-hash--",
    beneficiary: "--genesis-beneficiary--",
    difficulty: 1,
    number: 0,
    timestamp: "--genesis-timestamp--",
    nonce: 0,
  },
};

const MILLISECONDS = 1;

const SECONDS = 1000 * MILLISECONDS;

// 속도 기준을 13초로 한다.
const MINE_RATE = 13 * SECONDS;

module.exports = {
  GENESIS_DATA,
  MINE_RATE,
};
