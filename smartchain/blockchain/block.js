import { GENESIS_DATA, MINE_RATE } from "../config";
import { keccakHash } from "../util/index";

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

  static adjustDifficulty({ lastBlock, timestamp }) {
    const { difficulty } = lastBlock.blockHeaders;

    if (timestamp - lastBlock.blockHeaders.timestamp > MINE_RATE) {
      return difficulty - 1;
    }

    if (difficulty < 1) {
      return 1;
    }

    return difficulty + 1;
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
        difficulty: Block.adjustDifficulty({ lastBlock, timestamp }),
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

  // 올바른 블록이 전달되고 있는지 확인하는 함수
  static validateBlock({ lastBlock, block }) {
    return new Promise((resolve, reject) => {
      // genesis block은 해시로 검사한다.

      if (keccakHash(block) === keccakHash(Block.genesis())) {
        return resolve();
      }

      if (
        keccakHash(lastBlock.blockHeaders) !== block.blockHeaders.parentHash
      ) {
        return reject(
          new Error(
            "The parent hash must be a hash of the last block's headers"
          )
        );
      }

      if (block.blockHeaders.number !== lastBlock.blockHeaders.number + 1) {
        return reject(new Error("The block must increment the number by 1"));
      }

      if (
        Math.abs(
          lastBlock.blockHeaders.difficulty - block.blockHeaders.difficulty
        ) > 1
      ) {
        return reject(new Error("The difficulty must only adjust by 1"));
      }

      const target = Block.calculateBlockTargetHash({ lastBlock });
      const { blockHeaders } = block;
      const { nonce } = blockHeaders;

      const truncatedBlockHeaders = { ...blockHeaders };
      delete truncatedBlockHeaders.nonce;

      const header = keccakHash(truncatedBlockHeaders);
      const underTargetHash = keccakHash(header + nonce);

      if (underTargetHash > target) {
        return reject(
          new Error("The block not meet the proof of work requirement")
        );
      }
      return resolve();
    });
  }
}
export default Block;
