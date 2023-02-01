const Block = require("./block");

class BlockChain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  // catch에 에러도 담겨 있고, reject는 err가 떳다는 전제하에 실행된다.
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
        .catch(reject);
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
