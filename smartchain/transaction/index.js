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

  static validateStandardTransaction({ trnasaction }) {
    return new Promise((resolve, reject) => {
      const { from, signature } = trnasaction;
      const transactionData = { ...trnasaction };

      delete transactionData.signature;

      if (
        !Account.verifySignature({
          publicKey: from,
          data: transactionData,
          signature,
        })
      ) {
        return reject(new Error(`Transaction: ${id} signature is invalid`));
      }

      return resolve();
    });
  }

  static validateCreateAccountTransaction({ transaction }) {
    return new Promise((resolve, reject) => {
      const expectedAccountDataFields = Object.keys(new Account().toJSON());

      const fields = Object.keys(transaction.data.accountData);

      if (fields.length !== expectedAccountDataFields) {
        return reject(
          new Error(
            `The transaction account data has an incorrectt number of fields`
          )
        );
      }

      fields.forEach((field) => {
        if (!expectedAccountDataFields.includes(field)) {
          return reject(
            new Error(`
          The field: ${field} is expected for account data`)
          );
        }
      });

      return resolve();
    });
  }
}

export default Transaction;
