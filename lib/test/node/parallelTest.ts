import "should";
import bt from '../../../index';

var Parallel = bt.Parallel;
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

describe('Parallel Test', function () {
  it('should invoke the children in parallel', function () {
    var bb = {
      scount: 0,
      fcount: 0,
      wcount: 0
    };
    var pl = new Parallel({ blackboard: bb });
    pl.addChild(new SNode(bb));
    pl.addChild(new SNode(bb));
    pl.addChild(new SNode(bb));

    var res = pl.doAction();
    res.should.equal(bt.RES_SUCCESS);
    bb.scount.should.equal(3);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(0);

    res = pl.doAction();
    res.should.equal(bt.RES_SUCCESS);
    bb.scount.should.equal(6);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(0);
  });

  it('should fail if any child fail in fail on one policy', function () {
    var bb = {
      scount: 0,
      fcount: 0,
      wcount: 0
    };
    var pl = new Parallel({ blackboard: bb, policy: Parallel.POLICY_FAIL_ON_ONE });
    pl.addChild(new SNode(bb));
    pl.addChild(new FNode(bb));
    pl.addChild(new SNode(bb));

    var res = pl.doAction();
    res.should.equal(bt.RES_FAIL);
    bb.scount.should.equal(2);
    bb.fcount.should.equal(1);
    bb.wcount.should.equal(0);

    res = pl.doAction();
    res.should.equal(bt.RES_FAIL);
    bb.scount.should.equal(4);
    bb.fcount.should.equal(2);
    bb.wcount.should.equal(0);
  });

  it('should fail if and only if all children fail in fail on all policy', function () {
    var bb = {
      scount: 0,
      fcount: 0,
      wcount: 0
    };
    var pl = new Parallel({ blackboard: bb, policy: Parallel.POLICY_FAIL_ON_ALL });
    pl.addChild(new FNode(bb));
    pl.addChild(new FNode(bb));
    pl.addChild(new FNode(bb));

    var res = pl.doAction();
    res.should.equal(bt.RES_FAIL);
    bb.scount.should.equal(0);
    bb.fcount.should.equal(3);
    bb.wcount.should.equal(0);

    bb.fcount = 0;
    pl.addChild(new SNode(bb));
    res = pl.doAction();
    res.should.equal(bt.RES_SUCCESS);
    bb.scount.should.equal(1);
    bb.fcount.should.equal(3);
    bb.wcount.should.equal(0);
  });

  it('should wait if any child wait and reenter the wating child directly on next tick', function () {
    var bb = {
      scount: 0,
      fcount: 0,
      wcount: 0
    };
    var pl = new Parallel({ blackboard: bb });
    pl.addChild(new SNode(bb));
    pl.addChild(new WNode(bb));
    pl.addChild(new SNode(bb));

    var res = pl.doAction();
    res.should.equal(bt.RES_WAIT);
    bb.scount.should.equal(2);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(1);

    res = pl.doAction();
    res.should.equal(bt.RES_WAIT);
    bb.scount.should.equal(2);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(2);

    res = pl.doAction();
    res.should.equal(bt.RES_SUCCESS);
    bb.scount.should.equal(3);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(2);
  });
});
