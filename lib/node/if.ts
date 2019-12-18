import BTNode from "./node";
import Condition from "./condition";
import Sequence from "./sequence";

/**
 * If node: invoke the action if the condition is true
 * 
 * @param opts {Object}
 *        opts.blackboard {Object} blackboard
 *        opts.action {BTNode} action that would be invoked if cond return true
 *        opts.cond(blackboard) {Function} condition callback, return true or false.
 */
export default class If<T> extends BTNode<T> {
  action: Sequence<T>;
  constructor(opts: {
    blackboard: T,
    cond: Function,
    action: BTNode<T>
  }) {
    super(opts.blackboard);

    this.action = new Sequence({
      blackboard: opts.blackboard
    });
    var condition = new Condition({
      blackboard: opts.blackboard,
      cond: opts.cond
    });
    this.action.addChild(condition);
    this.action.addChild(opts.action);
  }

  /**
   * Move the current mob into patrol module and remove it from ai module.
   *
   * @return {Number} ai.RES_SUCCESS if everything ok;
   *                  ai.RES_FAIL if any error.
   */
  doAction(): number {
    return this.action.doAction();
  };
}