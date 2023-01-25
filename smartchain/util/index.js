const keccak256 = require("js-sha3").keccak256;

// 순서와 관계없이 주어진 객체에 대해서 일관된 문자열을 반환한다.
const sortCharacters = (data) => {
  return JSON.stringify(data).split("").sort().join("");
};

const keccakHash = (data) => {
  const hash = keccak256.create();

  // 동일한 객체에 대해서 동일한 해시를 생성하기 위함
  hash.update(sortCharacters(data));

  return hash.hex();
};

module.exports = {
  sortCharacters,
  keccakHash,
};
