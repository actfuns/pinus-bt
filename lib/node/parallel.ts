import bt from "../bt";
import Composite from "./composite";
import BTNode from "./node";

/**
 * Parallel node: a parent node that would invoke children in parallel.
 * The node would wait for all the children finished and return the result.
 * The result value would be decided by the policy.
 * POLICY_FAIL_ON_ONE stands for return fail if any fails;
 * POLICY_FAIL_ON_ALL stands for return fail if and only if all fail.
 */
export default class Parallel<T> extends Composite<T> {
  static POLICY_FAIL_ON_ONE: number = 0;
  static POLICY_FAIL_ON_ALL: number = 1;
  waits: BTNode<T>[];
  succ: number;
  fail: number;
  policy: number;
  constructor(opts: any) {
    super(opts.blackboard);
    this.policy = opts.policy || Parallel.POLICY_FAIL_ON_ONE;
    this.waits = [];
    this.succ = 0;
    this.fail = 0;
  }

  /**
   * do the action
   */
  doAction(): number {
    if (!this.children.length) {
      //if no child
      return bt.RES_SUCCESS;
    }

    var res;
    var rest: BTNode<T>[] = [];
    var origin = this.waits.length ? this.waits : this.children;

    //iterate all the children and record the results
    for (var i = 0, l = origin.length; i < l; i++) {
      res = origin[i].doAction();
      switch (res) {
        case bt.RES_SUCCESS:
          this.succ++;
          break;
        case bt.RES_WAIT:
          rest.push(origin[i]);
          break;
        default:
          this.fail++;
          break;
      }
    }

    if (rest.length) {
      //return wait if any in wait
      this.waits = rest;
      return bt.RES_WAIT;
    }

    //check the result if all have finished
    res = this.checkPolicy();
    this.reset();
    return res;
  };

  /**
   * reset the node state
   */
  reset() {
    this.waits.length = 0;
    this.succ = 0;
    this.fail = 0;
  };

  /**
   * check current state with policy
   *
   * @return {Number} ai.RES_SUCCESS for success and ai.RES_FAIL for fail
   */
  checkPolicy(): number {
    if (this.policy === Parallel.POLICY_FAIL_ON_ONE) {
      return this.fail ? bt.RES_FAIL : bt.RES_SUCCESS;
    }

    if (this.policy === Parallel.POLICY_FAIL_ON_ALL) {
      return this.succ ? bt.RES_SUCCESS : bt.RES_FAIL;
    }
  };
};