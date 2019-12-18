import "should";
import bt from '../../../index';

var Sequence = bt.Sequence;
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

describe('Sequence Test', function () {
  it('should invoke the children one by one', function () {
    var bb = {
      scount: 0,
      fcount: 0,
      wcount: 0
    };
    var sq = new Sequence({ blackboard: bb });
    sq.addChild(new SNode(bb));
    sq.addChild(new SNode(bb));
    sq.addChild(new SNode(bb));

    var res = sq.doAction();
    res.should.equal(bt.RES_SUCCESS);
    bb.scount.should.equal(3);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(0);

    res = sq.doAction();
    res.should.equal(bt.RES_SUCCESS);
    bb.scount.should.equal(6);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(0);
  });

  it('should fail if any child fail', function () {
    var bb = {
      scount: 0,
      fcount: 0,
      wcount: 0
    };
    var sq = new Sequence({ blackboard: bb });
    sq.addChild(new SNode(bb));
    sq.addChild(new FNode(bb));
    sq.addChild(new SNode(bb));

    var res = sq.doAction();
    res.should.equal(bt.RES_FAIL);
    bb.scount.should.equal(1);
    bb.fcount.should.equal(1);
    bb.wcount.should.equal(0);

    res = sq.doAction();
    res.should.equal(bt.RES_FAIL);
    bb.scount.should.equal(2);
    bb.fcount.should.equal(2);
    bb.wcount.should.equal(0);

  });

  it('should wait if any child wait and reenter the waiting child directly on next tick', function () {
    var bb = {
      scount: 0,
      fcount: 0,
      wcount: 0
    };
    var sq = new Sequence({ blackboard: bb });
    sq.addChild(new SNode(bb));
    sq.addChild(new WNode(bb));
    sq.addChild(new SNode(bb));

    var res = sq.doAction();
    res.should.equal(bt.RES_WAIT);
    bb.scount.should.equal(1);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(1);

    res = sq.doAction();
    res.should.equal(bt.RES_WAIT);
    bb.scount.should.equal(1);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(2);

    res = sq.doAction();
    res.should.equal(bt.RES_SUCCESS);
    bb.scount.should.equal(3);
    bb.fcount.should.equal(0);
    bb.wcount.should.equal(2);
  });
});
