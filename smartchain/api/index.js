const express = require("express");
const request = require("request");
const Blockchain = require("../blockchain");
const Block = require("../blockchain/block");
const PubSub = require("./pubsub");

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

// next는 객체를 처리할 수 있는 다음 미들웨어로 객체를 위임한다.
app.get("/blockchain", (req, res, next) => {
  const { chain } = blockchain;

  res.json({ chain });
});

app.get("/blockchain/mine", (req, res, next) => {
  const lastBlock = blockchain.chain[blockchain.chain.length - 1];
  const block = Block.mineBlock({ lastBlock });

  blockchain
    .addBlock({ block })
    .then(() => {
      // 블록이 생성되었음을 모두에게 알리기 위해서
      pubsub.broadcastBlock(block);

      res.json({ block });
    })
    .catch(next);
});

app.use((err, req, res, next) => {
  console.log("Internal server error: ", err);

  res.status(500).json({ message: err.message });
});

const peer = process.argv.includes("--peer");

// 포트를 유동적으로 변화시킨다 프로그램의 실행 여부에 따라서
const PORT = peer ? Math.floor(2000 + Math.random() * 1000) : 3000;

// 블록 동기화를 위해서 서버와 서버가 통신하게 하기 위함
if (peer) {
  request("http://localhost:3000/blockchain", (err, res, body) => {
    const { chain } = JSON.parse(body);

    blockchain
      .replaceChain({ chain })
      .then(() => console.log("Synchronized with the root node"))
      .catch((err) => console.log("Synchronizaion Error : ", err.message));
  });
}

app.listen(PORT, () => console.log(`Listening at PORT : ${PORT}`));
