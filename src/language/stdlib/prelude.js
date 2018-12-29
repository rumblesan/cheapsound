import * as logger from '../../logging';

import { addFunc } from './util';

import addStdTimingFuncs from './timing';

export function add(s) {
  addFunc(s, 'print', printFunc);
  addStdTimingFuncs(s);
}

function printFunc(msg) {
  logger.info(msg);
}
