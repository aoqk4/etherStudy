const { keccakHash } = require("../util");
const Block = require("./block");

describe("Block", () => {
  describe("calculateBlockTargetHash()", () => {
    it("calculates the maximum hash when the last block difficulty is 1", () => {
      expect(
        Block.calculateBlockTargetHash({
          lastBlock: { blockHeaders: { difficulty: 1 } },
        })
      ).toEqual("f".repeat(64));
    });

    it("calculates a low hash value when the last block difficulty is high", () => {
      expect(
        Block.calculateBlockTargetHash({
          lastBlock: { blockHeaders: { difficulty: 500 } },
        }) < "1"
      ).toBe(true);
    });
  });
  describe("mineBlock()", () => {
    let lastBlock, minedBlock;

    beforeEach(() => {
      lastBlock = Block.genesis();
      minedBlock = Block.mineBlock({ lastBlock, beneficiary: "beneficiary" });
    });

    it("mines a block", () => {
      expect(minedBlock).toBeInstanceOf(Block);
    });

    it("mines a block that meets the proof of work requirement", () => {
      const target = Block.calculateBlockTargetHash({ lastBlock });
      const { blockHeaders } = minedBlock;
      const { nonce } = blockHeaders;

      const truncatedBlockHeaders = { ...blockHeaders };

      delete truncatedBlockHeaders.nonce;

      const header = keccakHash(truncatedBlockHeaders);
      const underTargetHash = keccakHash(header + nonce);

      expect(underTargetHash < target).toBe(true);
    });
  });

  describe("adjustDifficulty()", () => {
    it("keeps the difficulty above 0", () => {
      expect(
        Block.adjustDifficulty({
          lastBlock: { blockHeaders: { difficulty: 0 } },
          timestamp: Date.now(),
        })
      ).toEqual(1);
    });

    // 13초 기준으로 푸는 속도 체크 했다 빠르면 올라가고 느리면 난이도 내려간다.
    it("increases the difficulty for a quickly mined block", () => {
      expect(
        Block.adjustDifficulty({
          lastBlock: { blockHeaders: { difficulty: 5, timestamp: 1000 } },
          timestamp: 3000,
        })
      ).toEqual(6);
    });

    it("decreases the difficulty for a quickly mined block", () => {
      expect(
        Block.adjustDifficulty({
          lastBlock: { blockHeaders: { difficulty: 5, timestamp: 1000 } },
          timestamp: 20000,
        })
      ).toEqual(4);
    });
  });

  describe("validateBlock()", () => {
    let block, lastBlock;

    beforeEach(() => {
      lastBlock = Block.genesis();
      block = Block.mineBlock({ lastBlock, beneficiary: "beneficiary" });
    });

    it("resolve when the block is genesis block", () => {
      expect(Block.validateBlock({ block: Block.genesis() })).resolves;
    });

    it("resolve if block is valid", () => {
      expect(Block.validateBlock({ lastBlock, block })).resolves;
    });

    it("reject when the parentHash is invalid", () => {
      block.blockHeaders.parentHash = "foo";
      expect(Block.validateBlock({ lastBlock, block })).rejects.toMatchObject({
        message: "The parent hash must be a hash of the last block's headers",
      });
    });

    it("reject when the number is not increased by one", () => {
      block.blockHeaders.number = 31255;
      expect(Block.validateBlock({ lastBlock, block })).rejects.toMatchObject({
        message: "The block must increment the number by 1",
      });
    });

    it("reject when the difficulty adjust by more than 1", () => {
      block.blockHeaders.difficulty = 23451;
      expect(Block.validateBlock({ lastBlock, block })).rejects.toMatchObject({
        message: "The difficulty must only adjust by 1",
      });
    });

    // 일반적으로 promise 안에서 돌아가서 테스트도 어렵다.
    // 상황을 강제해서 테스트 -> 함수를 오버라이딩해서 상황을 만든다.
    it("reject when the proof of work requirement is not met", () => {
      const originalCalculateBlockTargetHash = Block.calculateBlockTargetHash;

      Block.calculateBlockTargetHash = () => {
        return "0".repeat(64);
      };
      expect(Block.validateBlock({ lastBlock, block })).rejects.toMatchObject({
        message: "The block not meet the proof of work requirement",
      });

      Block.calculateBlockTargetHash = originalCalculateBlockTargetHash;
    });
  });
});
