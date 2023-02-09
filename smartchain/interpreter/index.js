"use strict";

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
var STOP = "STOP";
var ADD = "ADD";
var SUB = "SUB";
var MUL = "MUL";
var DIV = "DIV";
var PUSH = "PUSH";
var LT = "LT";
var GT = "GT";
var EQ = "EQ";
var AND = "AND";
var OR = "OR";
var JUMP = "JUMP";
var JUMPI = "JUMPI";
var ONCODE_MAP = {
  STOP: STOP,
  ADD: ADD,
  SUB: SUB,
  MUL: MUL,
  DIV: DIV,
  PUSH: PUSH,
  LT: LT,
  GT: GT,
  EQ: EQ,
  AND: AND,
  OR: OR,
  JUMP: JUMP,
  JUMPI: JUMPI
};
var EXECUTION_COMPLETE = "Execution complete";
var EXECUTION_LIMIT = 10000;
var Interpreter = /*#__PURE__*/function () {
  function Interpreter() {
    _classCallCheck(this, Interpreter);
    this.state = {
      programCounter: 0,
      stack: [],
      code: [],
      executionCount: 0
    };
  }
  _createClass(Interpreter, [{
    key: "jump",
    value: function jump() {
      var destination = this.state.stack.pop();
      if (destination < 0 || destination > this.state.code.length) {
        throw new Error("Invalid destination: ".concat(destination));
      }
      this.state.programCounter = destination;
      this.state.programCounter--;
    }
  }, {
    key: "runCode",
    value: function runCode(code) {
      this.state.code = code;
      while (this.state.programCounter < this.state.code.length) {
        this.state.executionCount++;
        if (this.state.executionCount > EXECUTION_LIMIT) {
          throw new Error("Check for an infinite loop. Execution limit of ".concat(EXECUTION_LIMIT));
        }
        var opCode = this.state.code[this.state.programCounter];
        try {
          switch (opCode) {
            case STOP:
              throw new Error(EXECUTION_COMPLETE);
            case PUSH:
              this.state.programCounter++;
              if (this.state.programCounter === this.state.code.length) {
                throw new Error("The PUSH instruction cannot be last.");
              }
              var value = this.state.code[this.state.programCounter];
              this.state.stack.push(value);
              break;
            case ADD:
            case SUB:
            case MUL:
            case DIV:
            case LT:
            case GT:
            case EQ:
            case AND:
            case OR:
              var a = this.state.stack.pop();
              var b = this.state.stack.pop();
              var result = void 0;
              if (opCode === ADD) result = a + b;
              if (opCode === DIV) result = a / b;
              if (opCode === SUB) result = a - b;
              if (opCode === MUL) result = a * b;
              if (opCode === LT) result = a < b ? 1 : 0;
              if (opCode === GT) result = a < b ? 0 : 1;
              if (opCode === EQ) result = a === b ? 1 : 0;
              if (opCode === AND) result = a && b;
              if (opCode === OR) result = a || b;
              this.state.stack.push(result);
              break;
            case JUMP:
              this.jump();
              break;
            case JUMPI:
              var condition = this.state.stack.pop();
              if (condition == 1) {
                this.jump();
              }
            default:
              break;
          }
        } catch (error) {
          if (error.message === EXECUTION_COMPLETE) {
            return this.state.stack[this.state.stack.length - 1];
          }
          throw error;
        }
        this.state.programCounter++;
      }
    }
  }]);
  return Interpreter;
}();
Interpreter.ONCODE_MAP = ONCODE_MAP;
module.exports = Interpreter;

// let code = [PUSH, 2, PUSH, 3, ADD, STOP];
// let result = new Interpreter().runCode(code);
// console.log("Result of 3 ADD 2:", result);

// code = [PUSH, 2, PUSH, 3, SUB, STOP];
// result = new Interpreter().runCode(code);
// console.log("Result of 3 SUB 2:", result);

// code = [PUSH, 2, PUSH, 3, MUL, STOP];
// result = new Interpreter().runCode(code);
// console.log("Result of 3 MUL 2:", result);

// code = [PUSH, 2, PUSH, 3, DIV, STOP];
// result = new Interpreter().runCode(code);
// console.log("Result of 3 DIV 2:", result);

// code = [PUSH, 2, PUSH, 3, LT, STOP];
// result = new Interpreter().runCode(code);
// console.log("Result of 3 LT 2:", result);

// code = [PUSH, 2, PUSH, 3, GT, STOP];
// result = new Interpreter().runCode(code);
// console.log("Result of 3 GT 2:", result);

// code = [PUSH, 2, PUSH, 2, EQ, STOP];
// result = new Interpreter().runCode(code);
// console.log("Result of 2 EQ 2:", result);

// code = [PUSH, 1, PUSH, 0, AND, STOP];
// result = new Interpreter().runCode(code);
// console.log("Result of 0 AND 1:", result);

// code = [PUSH, 1, PUSH, 0, OR, STOP];
// result = new Interpreter().runCode(code);
// console.log("Result of 0 OR 1:", result);

// code = [PUSH, 6, JUMP, PUSH, 0, JUMP, PUSH, "jump sucessful", STOP];
// result = new Interpreter().runCode(code);
// console.log("Result of JUMP : ", result);

// code = [PUSH, 8, PUSH, 1, JUMPI, PUSH, 0, JUMPI, PUSH, "jump sucessful", STOP];
// result = new Interpreter().runCode(code);
// console.log("Result of JUMPI : ", result);

// try {
//   code = [PUSH, 99, JUMP, PUSH, 0, JUMP, PUSH, "jump sucessful", STOP];
//   result = new Interpreter().runCode(code);
//   console.log("Result of JUMP : ", result);
// } catch (err) {
//   console.log(err.message);
// }

// try {
//   code = [PUSH, 0, PUSH];
//   result = new Interpreter().runCode(code);
//   console.log("Result of JUMP : ", result);
// } catch (err) {
//   console.log(err.message);
// }

// try {
//   code = [PUSH, 0, JUMP, STOP];
//   result = new Interpreter().runCode(code);
//   console.log("Result of JUMP : ", result);
// } catch (err) {
//   console.log(err.message);
// }