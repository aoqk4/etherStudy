import { STARTING_BALANCE } from "../config.cjs";
// import { ecfun, keccakHash } from "../util/index.js";

import { ecfun, keccakHash } from "../util/index.js";

class Account {
  constructor() {
    this.keyPair = ecfun.genKeyPair();
    this.address = this.keyPair.getPublic().encode("hex");

    // 시작 값(화폐?)
    this.balance = STARTING_BALANCE;
  }

  // 데이터에 서명 하는 메소드 호출
  sign(data) {
    return this.keyPair.sign(keccakHash(data));
  }

  toJSON() {
    return {
      address: this.address,
      balance: this.balance,
    };
  }

  // 서명 확인
  static verifySignature({ publicKey, data, signature }) {
    const keyFromPublic = ec.keyFromPublic(publicKey, "hex");

    return keyFromPublic.verify(keccakHash(data), signature);
  }
}

export default Account;
