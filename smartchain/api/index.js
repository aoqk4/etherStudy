const express = require("express");
const Blockchain = require("../blockchain");
const Block = require("../blockchain/block");

const app = express();
const blockchain = new Blockchain();

// next는 객체를 처리할 수 있는 다음 미들웨어로 객체를 위임한다.
app.get("/blockchain", (req, res, next) => {
  const { chain } = blockchain;

  res.json({ chain });
});

app.get("/blockchain/mine", (req, res, next) => {
  const lastBlock = blockchain.chain[blockchain.chain.length - 1];
  const block = Block.mineBlock({ lastBlock });

  block.blockHeaders.parentHash = "foo";

  blockchain
    .addBlock({ block })
    .then(() => {
      res.json({ block });
    })
    .catch(next);
});

app.use((err, req, res, next) => {
  console.log("Internal server error: ", err);

  res.status(500).json({ message: err.message });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Listening at PORT : ${PORT}`));
