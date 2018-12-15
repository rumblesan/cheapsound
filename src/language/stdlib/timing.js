import { addFunc } from './util';

import * as scheduler from '../runtime/scheduler';

export default function addStdTimingFuncs(s) {
  addFunc(s, 'in', inFunc);
  addFunc(s, 'every', everyFunc);
  addFunc(s, 'removeTimer', removeTimerFunc);
  addFunc(s, 'setBPM', setBPMFunc);
  addFunc(s, 'getBPM', getBPMFunc);
}

function inFunc(wait, lambda) {
  return scheduler.addScheduledEvent(wait, 'once', lambda);
}

function everyFunc(interval, lambda) {
  return scheduler.addScheduledEvent(interval, 'repeat', lambda);
}

function removeTimerFunc(id) {
  scheduler.removeScheduledEvent(id);
}

function setBPMFunc(bpm) {
  return scheduler.setBPM(bpm);
}

function getBPMFunc() {
  return scheduler.getBPM();
}
