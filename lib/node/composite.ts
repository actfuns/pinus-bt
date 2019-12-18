import BTNode from "./node";

/**
 * Composite node: parent of nodes that have multi-children. 
 */
export default abstract class Composite<T> extends BTNode<T> {
  children: BTNode<T>[];

  constructor(blackboard: T) {
    super(blackboard);

    this.children = [];
  };

  /**
   * Add a child to the node
   */
  addChild(node: BTNode<T>) {
    this.children.push(node);
  };
}
