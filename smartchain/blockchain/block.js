const { GENESIS_DATA } = require("../config");
const { keccakHash } = require("../util/index");

const HASH_LENGTH = 64;
const MAX_HASH_VALUE = parseInt("f".repeat(HASH_LENGTH), 16);

const MAX_NONCE_VALUE = 2 ** 64;

class Block {
  constructor({ blockHeaders }) {
    this.blockHeaders = blockHeaders;
  }

  static calculateBlockTargetHash({ lastBlock }) {
    const value = (MAX_HASH_VALUE / lastBlock.blockHeaders.difficulty).toString(
      16
    );

    if (value.length > HASH_LENGTH) {
      return "f".repeat(HASH_LENGTH);
    }

    return "0".repeat(HASH_LENGTH - value.length) + value;
  }

  // 전 블록들이 이어져 있어서 블록을 캘 때는 전 블록을 이용해야 한다.
  // 그럼 빈 배열일때 마지막 블록은? -> 제네시스 블록 이용한다.
  static mineBlock({ lastBlock, beneficiary }) {
    const target = Block.calculateBlockTargetHash({ lastBlock });
    let timestamp, truncatedBlockHeaders, header, nonce, underTargetHash;

    // 만족값을 찾아내는 헤더의 nonce를 찾아내는게 블록체인 채굴의 핵심이다..
    // 왜? 다른건 이미 정해져 있고, nonce값만 일정하지 않으니깐.
    // 현 경우에는 이전 해시보다 작은 해시를 찾아서 시드를 미친듯이 돌려야한다..
    do {
      timestamp = Date.now();
      truncatedBlockHeaders = {
        parentHash: keccakHash(lastBlock.blockHeaders),
        beneficiary,
        difficulty: lastBlock.blockHeaders.difficulty + 1,
        number: lastBlock.blockHeaders.number + 1,
        timestamp,
      };

      header = keccakHash(truncatedBlockHeaders);
      nonce = Math.floor(Math.random() * MAX_NONCE_VALUE);
      underTargetHash = keccakHash(header + nonce);
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
      blockHeaders: {
        ...truncatedBlockHeaders,
        nonce,
      },
    });
  }

  static genesis = () => {
    return new Block(GENESIS_DATA);
  };
}
module.exports = Block;
