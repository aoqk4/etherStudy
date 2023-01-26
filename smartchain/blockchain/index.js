const Block = require("./block");

class BlockChain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ block }) {
    this.chain.push(block);
  }
}

module.exports = BlockChain;

// 블록 생성 해보는 Debug Code
// const blockchain = new BlockChain();

// for (let i = 0; i < 1000; i++) {
//   const lastBlock = blockchain.chain[blockchain.chain.length - 1];
//   const block = Block.mineBlock({
//     lastBlock,
//     beneficiary: "beneficiary",
//   });

//   blockchain.addBlock({ block });

//   console.log("block", block);
// }
