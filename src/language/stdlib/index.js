import * as logger from '../../logging';

import { addFunc, defModule } from './util';

import addStdMidiFuncs from './midi';
import addStdTimingFuncs from './timing';

export function setup(interpreterState) {
  addFunc(interpreterState, 'print', printFunc);
  addFunc(interpreterState, 'next', nextFuncGenerator());
  addStdTimingFuncs(interpreterState);
}

export function importModule({ name, vars, alias }, interpreterState) {
  switch (name) {
    case 'midi':
      defModule(interpreterState, addStdMidiFuncs, alias || 'midi', vars);
      break;
  }
}

function printFunc(msg) {
  logger.info(msg);
}

function nextFuncGenerator() {
  let v = 0;
  const nextFunc = list => {
    const out = list[v];
    v += 1;
    if (v >= list.length) {
      v = 0;
    }
    return out;
  };
  return nextFunc;
}
