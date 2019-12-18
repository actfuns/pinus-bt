import "should";
import bt from '../../../index';

let If = bt.If;
class BB {
  scount: number = 0;
  fcount: number = 0;
  wcount: number = 0;
}
class SNode extends bt.Node<BB> {
  constructor(blackboard: BB) {
    super(blackboard);
    this.blackboard = blackboard;
  }
  doAction() {
    this.blackboard.scount++;
    return bt.RES_SUCCESS;
  }
}

class FNode extends bt.Node<BB> {
  constructor(blackboard: BB) {
    super(blackboard);
    this.blackboard = blackboard;
  }
  doAction() {
    this.blackboard.fcount++;
    return bt.RES_FAIL;
  }
}

class WNode extends bt.Node<BB> {
  constructor(blackboard: BB) {
    super(blackboard);
    this.blackboard = blackboard;
  }
  doAction() {
    if (this.blackboard.wcount < 2) {
      this.blackboard.wcount++;
      return bt.RES_WAIT;
    } else {
      this.blackboard.scount++;
      return bt.RES_SUCCESS;
    }
  }
}

describe('If Test', function () {
  it('should invoke the action if condition return true', function () {
    let bb = new BB();

    let cond = function () {
      return true;
    };

    let i = new If({ blackboard: bb, action: new SNode(bb), cond: cond });

    var res = i.doAction();
    res.should.equal(bt.RES_SUCCESS);
    bb.scount.should.equal(1);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(0);
  });

  it('should return fail if condition return false', function () {
    let bb = new BB();
    let cond = function (bb: BB) {
      return false;
    };

    let i = new If({ blackboard: bb, action: new SNode(bb), cond: cond });

    let res = i.doAction();
    res.should.equal(bt.RES_FAIL);
    bb.scount.should.equal(0);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(0);
  });

  it('should return fail if action return false', function () {
    let bb = new BB();
    let cond = function () {
      return true;
    };

    let i = new If({ blackboard: bb, action: new FNode(bb), cond: cond });

    let res = i.doAction();
    res.should.equal(bt.RES_FAIL);
    bb.scount.should.equal(0);
    bb.fcount.should.equal(1);
    bb.wcount.should.equal(0);
  });

  it('should return wait if the child return wait and reenter the child directly in next tick', function () {
    let bb = new BB();
    let condCount = 0;

    let cond = function () {
      condCount++;
      return true;
    };

    let i = new If({ blackboard: bb, action: new WNode(bb), cond: cond });

    let res = i.doAction();
    res.should.equal(bt.RES_WAIT);
    bb.scount.should.equal(0);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(1);
    condCount.should.equal(1);

    res = i.doAction();
    res.should.equal(bt.RES_WAIT);
    bb.scount.should.equal(0);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(2);
    condCount.should.equal(1);

    res = i.doAction();
    res.should.equal(bt.RES_SUCCESS);
    bb.scount.should.equal(1);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(2);
    condCount.should.equal(1);
  });
});
