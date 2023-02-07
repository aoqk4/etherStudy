import request from "request";

const BASE_URL = "http://localhost:3000";

const postTransact = ({ to, value }) => {
  return new Promise((resolve, reject) => {
    request(
      `${BASE_URL}/account/transact`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, value }),
      },
      (err, res, body) => {
        return resolve(JSON.parse(body));
      }
    );
  });
};

postTransact({})
  .then((res) => {
    console.log(res);

    const toAccountData = res.transaction.data.accountData;

    return postTransact({ to: toAccountData, value: 20 });
  })
  .then((res2) => {
    console.log("postTransactResult2", res2);
  });
// postTransact({ to: "foo-recipent", value: 20 }).then((res) => {
//   console.log("postTransactResult", res);
// });
