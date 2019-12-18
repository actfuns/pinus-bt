import bt from "./lib/bt";
import Node from './lib/node/node';
import Composite from './lib/node/composite';
import Condition from './lib/node/condition';
import Decorator from './lib/node/decorator';
import Sequence from './lib/node/sequence';
import Parallel from './lib/node/parallel';
import Select from './lib/node/select';
import Loop from './lib/node/loop';
import If from './lib/node/if';

var RES_SUCCESS = bt.RES_SUCCESS;
var RES_FAIL = bt.RES_FAIL;
var RES_WAIT = bt.RES_WAIT;
export default { RES_SUCCESS, RES_FAIL, RES_WAIT, Node, Composite, Condition, Decorator, Sequence, Parallel, Select, Loop, If };