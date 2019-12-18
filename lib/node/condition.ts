import bt from "../bt";
import BTNode from "./node";

/**
 * Condition node.
 *
 * @param opts {Object} 
 *        opts.blackboard {Object} blackboard object
 *        opts.cond(blackboard) {Function} condition callback. Return true or false to decide the node return success or fail.
 * @return {Number} 
 *          bt.RES_SUCCESS if cond callback return true;
 *          bt.RES_FAIL if cond undefined or return false.
 */
export default class Condition<T> extends BTNode<T> {
  cond: Function;
  constructor(opts: {
    blackboard: T,
    cond: Function
  }) {
    super(opts.blackboard);
    this.cond = opts.cond;
  }

  doAction(): number {
    if (this.cond && this.cond.call(null, this.blackboard)) {
      return bt.RES_SUCCESS;
    }
    return bt.RES_FAIL;
  }
}