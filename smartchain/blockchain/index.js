const Block = require("./block");

class BlockChain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ block }) {
    return new Promise((resolve, reject) => {
      Block.validateBlock({
        lastBlock: this.chain[this.chain.length - 1],
        block,
      })
        .then((result) => {
          this.chain.push(block);

          return resolve();
        })
        .catch((err) => reject(err));
    });
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
