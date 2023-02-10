# Smart Contract Ethereum

## Udemy 영상으로 학습한 것 개인 정리한 것.

## 코드의 주석에 조금 더 자세한 내용을 넣었음.

## Day 1. Interpreter Tutorial

### impl for SmartContract in Interpreter Class

- Based Language : JavaScript

1. operation
2. Comparisons and Logic(AND, OR, EQ, LT, GT...)
3. Jump
4. Validation

## Day 2 Goal

1. testing Logic
2. Simple BlockChain tutorial..

## Day 2. Testing with Jest & simple blockchain

1. Testing Day1 SmartContract interpreter with JS Jest(testing framework?).
2. Make simple Blockchain Class & genesis Block
3. Make Util fun(sortCharacters())

## Day 3 Goal

1. Understand Hash...
2. impl Based Mining For an Ethereum

## Day 3. Impl Hash with keccakHash & Impl - Test sample mine Block

1. Hash Overview & Impl Hash with keccakHash (sortCharacters() and Use Hash algorithm)
2. Impl and test sample Mine Block

## Day 4 Goal

1. Adjust Difficulty
2. Validate Block?
3. Validate Block method test

## Day 4. Adjust Difficulty for mineBlock

1. Adjust Difficulty for mine Block & jest Test.

## Day 5 Goal

1. Validate Block

## Day 5. Validae Block method with JS promise & Overview Block chain network

1. Validae Block method with JS promise & jest test
2. Overview Block chain network(HTTP API & PUB / SUB)

## Day 6 Goal

1. Simple Network method for HTTP API & PUB / SUB

## Day 6. impl blockchain API & PUB / SUB system

1. impl HTTP blockchain API use express.js
2. impl PUB / SUB sys use PubNub

## Day 7. BroadcastBlock & Synchronization Chain

1. Set root & other port(peer?) and broadcast Block (broadcastBlock() method)
2. Synchronization validated chain all of the port(peer?) (replaceChain() method)

## Day 8 Goal

1. Accounts and Transactions?

## Day 8. Account & Tranaction

0. Change type : module & encryption util (elliptic)

1. impl default multi key (pu, pb) Account for transaction.

2. impl transaction for create account & default transaction.

## Day 9 Goal

1. Validate Transaction & More?

## Day 9. Validate Transaction

1. Validate Transaction code in Transaction Class

2. Test code (but es6 jest error...)

## Day 10 Goal

1. Transaction Queue

2. Transaction endPoint?

## Day 10. impl API for transaction

1. Make Transaction Queue

2. add Transaction in Transaction Queue

3. impl Transaction API (create Account & default Transact)

## Day 11 Goal

1. PubSub broadCast Transaction.

2. Block TransactionSeries?

## Day 11. Transaction Broadcast

1. add broadcastTransaction method in pubsub class

2. Create transaction & Push TransactionQueue & broadcast
   in /account/transact API

## Day 12 Goal

1. block transacion

2. World State and Running Block of Transaction Overview

## Day 12. Transaction Series & make new error...

0. I don't know that.. change babel & much of try...

1. Transaction Series impl & test

## Day 13 Goal

0. fix error.......

1. impl Tries for Block trasaction

## Day 13. impl Tries.

0. 다음부턴 무조건 ts + babel 이다.. 중간 에러를 도저히 못찾겠다.
   --> clone 가능하나, 일단은 들을것은 다 들은 것 같다..
   --> 일단은 클론까지는 해놓고 천천히 소스 보면서 나머지 듣는거로
   (우선순위 하)

1. impl Tries for BlockTransactionSeries
