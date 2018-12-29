import midi from 'midi';
import * as scheduler from '../runtime/scheduler';

import { addFunc } from './util';

const output = new midi.output();

export default function addStdMidiFuncs(s) {
  addFunc(s, 'open', openMidiPortFunc);
  addFunc(s, 'getPorts', getPortsFunc);
  addFunc(s, 'close', closeMidiPortFunc);
  addFunc(s, 'play', playFunc);
}

function getPortsFunc() {
  const out = [];
  const c = output.getPortCount();
  for (let i = 0; i < c; i++) {
    out.push(`${i}: ${output.getPortName(i)}`);
  }
  return out;
}

function openMidiPortFunc(num) {
  output.openPort(num);
}

function closeMidiPortFunc() {
  output.closePort();
}

function playFunc({ note, duration, velocity, channel }) {
  scheduler.addScheduledEvent(duration, 'once', {
    type: 'lambda',
    func: () => {
      output.sendMessage([128 + channel, note, 0]);
    },
  });
  output.sendMessage([144 + channel, note, velocity]);
}
