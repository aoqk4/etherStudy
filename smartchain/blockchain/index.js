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

  // 체인안에 블록들을 검사하고 바뀐 체인을 반영하기 위해서
  replaceChain({ chain }) {
    return new Promise(async (resolve, reject) => {
      for (let i = 0; i < chain.length; i++) {
        const block = chain[i];
        const lastBlockIndex = i - 1;
        const lastBlock = lastBlockIndex >= 0 ? chain[i - 1] : null;
        // 비동기 방식으로 이루어지기 때문에 실시간으로 체인을 검사 X
        // for 는 돌아가는데 한번에 두개 이상의 블록이 들어갈수도 있다는 말?
        // await 키워드 사용하자.
        try {
          await Block.validateBlock({ lastBlock, block });
        } catch (err) {
          return reject(err);
        }

        console.log(
          `* -- Validated block number : ${block.blockHeaders.number}`
        );
      }
      this.chain = chain;

      return resolve();
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
