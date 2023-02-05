import { v4 } from "uuid";
import Account from "../account/index.js";

const TRNASACTION_TYPE_MAP = {
  CREATE_ACCOUNT: "CREATE_ACCOUNT",
  TRANSACT: "TRANSACT",
};

class Transaction {
  constructor({ id, from, to, value, data, signature }) {
    this.id = id || v4();
    this.from = from || "-";
    this.to = to || "-";
    this.value = value || 0;
    this.data = data || "-";
    this.signature = signature || "-";
  }

  static createTransaction({ account, to, value }) {
    // 보내는 사람이 있으면 거래, 아니면 계정 생성?
    if (to) {
      const transactionData = {
        id: v4(),
        from: account.address,
        to,
        value,
        data: { type: TRNASACTION_TYPE_MAP.TRANSACT },
      };

      return new Transaction({
        ...transactionData,
        signature: account.sign(transactionData),
      });
    }

    return new Transaction({
      data: {
        type: TRNASACTION_TYPE_MAP.CREATE_ACCOUNT,
        accountData: account.toJSON(),
      },
    });
  }
}

export default Transaction;

const account = new Account();

const transaction = Transaction.createTransaction({
  account,
});

console.log("transaction", transaction);
