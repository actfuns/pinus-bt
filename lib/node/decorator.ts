import BTNode from "./node";

/**
 * Decorator node: parent of nodes that decorate other node. 
 */
export default abstract class Decorator<T> extends BTNode<T> {
  child: any;
  constructor(blackboard: T, child: BTNode<T>) {
    super(blackboard);
    this.child = child;
  };

  /**
   * set the child fo the node
   */
  setChild(node: BTNode<T>) {
    this.child = node;
  };
}