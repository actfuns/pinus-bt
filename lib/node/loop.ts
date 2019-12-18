import bt from "../bt";
import Decorator from "./decorator";

/**
 * Loop node: a decorator node that invoke child in loop.
 *
 * @param opts {Object} 
 *        opts.blackboard {Object} blackboard object
 *        opts.child {Object} origin action that is decorated
 *        opts.loopCond(blackboard) {Function} loop condition callback. Return true to continue the loop.
 * @return {Number} 
 *          bt.RES_SUCCESS if loop finished successfully;
 *          bt.RES_FAIL and break loop if child return fail;
 *          bt.RES_WAIT if child return wait or loop is continue.
 */
export default class Loop<T> extends Decorator<T> {
  loopCond: Function;
  constructor(opts: {
    blackboard?: T,
    child: any
    loopCond?: Function
  }) {
    super(opts.blackboard, opts.child);
    this.loopCond = opts.loopCond;
  }

  doAction() {
    var res = this.child.doAction();
    if (res !== bt.RES_SUCCESS) {
      return res;
    }
    if (this.loopCond && this.loopCond.call(null, this.blackboard)) {
      //wait next tick
      return bt.RES_WAIT;
    }
    return bt.RES_SUCCESS;
  };
}
