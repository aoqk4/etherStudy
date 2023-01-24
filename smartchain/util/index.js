// 순서와 관계없이 주어진 객체에 대해서 일관된 문자열을 반환한다.
const sortCharacters = (data) => {
  return JSON.stringify(data).split("").sort().join("");
};

module.exports = {
  sortCharacters,
};
