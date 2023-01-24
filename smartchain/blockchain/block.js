const { GENESIS_DATA } = require("../config");

class Block {
  constructor({ blockHeaders }) {
    this.blockHeaders = blockHeaders;
  }

  // 전 블록들이 이어져 있어서 블록을 캘 때는 전 블록을 이용해야 한다.
  // 그럼 빈 배열일때 마지막 블록은? -> 제네시스 블록 이용한다.
  static mineBlock({ lastBlock }) {}

  static genesis = () => {
    return new Block(GENESIS_DATA);
  };
}
module.exports = Block;
