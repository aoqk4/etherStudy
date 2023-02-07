export default class TransactionQueue {
  constructor() {
    // 객체로 생성하면 중복 transaction 방지에 도움이된다.
    this.transactionMap = {};
  }

  add(transaction) {
    this.transactionMap[transaction.id] = transaction;
  }

  getTransactionSeries() {
    return Object.values(this.transactionMap);
  }
}
