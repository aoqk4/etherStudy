import Transaction from "./index.js";
import Account from "../account/index.js";

describe("Transaction", () => {
  let account, standardTransaction, createTransaction;

  beforeEach(() => {
    account = new Account();
    standardTransaction = Transaction.createTransaction({
      account,
      to: "foo-recipent",
      value: 50,
    });
    createTransaction = Transaction.createTransaction({
      account,
    });
  });

  describe("validateStandardTransaction()", () => {
    it("validates a valid transaction", () => {
      expect(
        Transaction.validateStandardTransaction({
          transaction,
        })
      ).resolves;
    });

    it("does not validates a valid transaction", () => {
      standardTransaction.to = "different-recipient";

      expect(
        Transaction.validateStandardTransaction({
          transaction,
        })
      ).rejects.toMatchObject({ message: /invalid/ });
    });
  });

  describe("validateStandardTransaction()", () => {
    it("validates a create account transaction", () => {
      expect(
        Transaction.validateCreateAccountTransaction({
          transaction,
        })
      ).resolves;
    });

    it("does not validates a create account transaction", () => {
      expect(
        Transaction.standardTransaction({
          transaction,
        })
      ).rejects.toMatchObject({ message: /incorrect/ });
    });
  });
});
