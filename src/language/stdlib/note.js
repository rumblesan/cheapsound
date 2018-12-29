import { addFunc, addVar } from './util';

export default function addNoteLib(s) {
  addFunc(s, 'Note', Note);
  addFunc(s, 'velocity', velocityFunc);
  addFunc(s, 'duration', durationFunc);
  addFunc(s, 'octaveUp', octaveUpFunc);
  addFunc(s, 'octaveDown', octaveDownFunc);

  for (let n = 9; n < 128; n += 1) {
    addVar(s, noteName(n), Note(n));
  }
}

function Note(note, velocity, duration, channel) {
  return {
    type: 'note',
    note,
    velocity: velocity || 100,
    duration: duration || 0.5,
    channel: channel || 0,
  };
}

function velocityFunc({ note, duration, channel }, velocity) {
  return Note(note, velocity, duration, channel);
}

function durationFunc({ note, velocity, channel }, duration) {
  return Note(note, velocity, duration, channel);
}

function octaveUpFunc({ note, velocity, channel, duration }) {
  return Note(note + 12, velocity, duration, channel);
}

function octaveDownFunc({ note, velocity, channel, duration }) {
  return Note(note - 12, velocity, duration, channel);
}

const names = ['a', 'a#', 'b', 'c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#'];
function noteName(v) {
  const name = names[(v + 3) % 12];
  const octave = Math.floor(v / 12) - 2;
  return `${name}${octave}`;
}
