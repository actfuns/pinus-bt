export default abstract class BTNode<T> {
  blackboard: T;
  constructor(blackboard?: T) {
    this.blackboard = blackboard;
  }
  abstract doAction(): number;
}