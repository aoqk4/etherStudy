import Interpreter, { ONCODE_MAP } from "./index";

const { STOP, ADD, SUB, MUL, DIV, PUSH, LT, GT, EQ, AND, OR, JUMP, JUMPI } =
  ONCODE_MAP;

describe("Interpreter", () => {
  describe("runCode()", () => {
    describe("and the code inludes ADD", () => {
      it("adds two values", () => {
        expect(
          new Interpreter().runCode([PUSH, 2, PUSH, 3, ADD, STOP])
        ).toEqual(5);
      });
    });

    describe("and the code inludes SUB", () => {
      it("subtracts one value from another", () => {
        expect(
          new Interpreter().runCode([PUSH, 2, PUSH, 3, SUB, STOP])
        ).toEqual(1);
      });
    });

    describe("and the code inludes MUL", () => {
      it("prodcuts two values", () => {
        expect(
          new Interpreter().runCode([PUSH, 2, PUSH, 3, MUL, STOP])
        ).toEqual(6);
      });
    });

    describe("and the code inludes DIV", () => {
      it("divide one value from another", () => {
        expect(
          new Interpreter().runCode([PUSH, 2, PUSH, 3, DIV, STOP])
        ).toEqual(1.5);
      });
    });

    describe("and the code inludes LT", () => {
      it("checks if one value is less than another", () => {
        expect(new Interpreter().runCode([PUSH, 2, PUSH, 3, LT, STOP])).toEqual(
          0
        );
      });
    });

    describe("and the code inludes GT", () => {
      it("checks if one value is great than another", () => {
        expect(new Interpreter().runCode([PUSH, 2, PUSH, 3, GT, STOP])).toEqual(
          1
        );
      });
    });

    describe("and the code inludes EQ", () => {
      it("checks if one value is equal than another", () => {
        expect(new Interpreter().runCode([PUSH, 2, PUSH, 3, EQ, STOP])).toEqual(
          0
        );
      });
    });

    describe("and the code inludes AND", () => {
      it("ands two conditions", () => {
        expect(new Interpreter().runCode([PUSH, 1, PUSH, 0, EQ, STOP])).toEqual(
          0
        );
      });
    });

    describe("and the code inludes OR", () => {
      it("ors two conditions", () => {
        expect(new Interpreter().runCode([PUSH, 1, PUSH, 0, OR, STOP])).toEqual(
          1
        );
      });
    });

    describe("and the code inludes JUMP", () => {
      it("jumps to a destination", () => {
        expect(
          new Interpreter().runCode([
            PUSH,
            6,
            JUMP,
            PUSH,
            0,
            JUMP,
            PUSH,
            "jump sucessful",
            STOP,
          ])
        ).toEqual("jump sucessful");
      });
    });

    describe("and the code inludes JUMP I", () => {
      it("jumps to a destination", () => {
        expect(
          new Interpreter().runCode([
            PUSH,
            8,
            PUSH,
            1,
            JUMPI,
            PUSH,
            0,
            JUMPI,
            PUSH,
            "jump sucessful",
            STOP,
          ])
        ).toEqual("jump sucessful");
      });
    });

    // try catch를 잡을 경우에는 그 하나의 에러 테스트를 콜백으로 묶는다.
    describe("and the code inludes an invalid JUMP destination", () => {
      it("throws an error", () => {
        expect(() =>
          new Interpreter().runCode([
            PUSH,
            99,
            JUMP,
            PUSH,
            0,
            JUMP,
            PUSH,
            "jump sucessful",
            STOP,
          ])
        ).toThrow("Invalid destination: 99");
      });
    });

    describe("and the code inludes an invalid PUSH destination", () => {
      it("throws an error", () => {
        expect(() => new Interpreter().runCode([PUSH, 0, PUSH])).toThrow(
          "The PUSH instruction cannot be last."
        );
      });
    });

    describe("and the code inludes an infinite loo[", () => {
      it("throws an error", () => {
        expect(() => new Interpreter().runCode([PUSH, 0, JUMP, STOP])).toThrow(
          "Check for an infinite loop. Execution limit of 10000"
        );
      });
    });
  });
});
