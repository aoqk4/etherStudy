import EEC from "elliptic";
const { ec: EC } = EEC;
import SHA from "js-sha3";
const { keccak256 } = SHA;

// 암호화를 위한 객체 생성
export const ecfun = new EC("secp256k1");

// 순서와 관계없이 주어진 객체에 대해서 일관된 문자열을 반환한다.
export const sortCharacters = (data) => {
  return JSON.stringify(data).split("").sort().join("");
};

export const keccakHash = (data) => {
  const hash = keccak256.create();

  // 동일한 객체에 대해서 동일한 해시를 생성하기 위함
  hash.update(sortCharacters(data));

  return hash.hex();
};
