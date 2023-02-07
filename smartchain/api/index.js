import express from "express";
import request from "request";
import bodyParser from "body-parser";

import mineBlock from "../blockchain/block.js";
import Blockchain from "../blockchain/index.js";
import Account from "../account/index.js";
import PubSub from "./pubsub.js";
import Transaction from "../transaction/index.js";
import TransactionQueue from "../transaction/transaction-queue.js";

const app = express();

app.use(bodyParser.json());

const blockchain = new Blockchain();
const transactionQueue = new TransactionQueue();
const pubsub = new PubSub({ blockchain });
const account = new Account();
const transaction = Transaction.createTransaction({ account });

transactionQueue.add(transaction);

// next는 객체를 처리할 수 있는 다음 미들웨어로 객체를 위임한다.
app.get("/blockchain", (req, res, next) => {
  const { chain } = blockchain;

  res.json({ chain });
});

app.get("/blockchain/mine", (req, res, next) => {
  const lastBlock = blockchain.chain[blockchain.chain.length - 1];
  const block = mineBlock({ lastBlock, beneficiary: account.address });

  blockchain
    .addBlock({ block })
    .then(() => {
      // 블록이 생성되었음을 모두에게 알리기 위해서
      pubsub.broadcastBlock(block);

      res.json({ block });
    })
    .catch(next);
});

app.post("/account/transact", (req, res, next) => {
  const { to, value } = req.body;
  const transaction = Transaction.createTransaction({
    account: !to ? new Account() : account,
    to,
    value,
  });
  transactionQueue.add(transaction);

  res.json({ transaction });
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
