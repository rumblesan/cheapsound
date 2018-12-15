import { interpretLambda } from '../interpreter';
import logger from '../../logging';

const scheduler = {
  bpm: 120,
  running: false,
  beat: 0,
  beatsInBar: 4,
  eventID: 0,
  scheduled: [],
};

export function start(interpreterState) {
  if (!scheduler.running) {
    scheduler.interpreterState = interpreterState;
    scheduler.running = true;
    const t = process.hrtime();
    setTimeout(next, 10, t);
    return true;
  } else {
    logger.error('scheduler is already running');
    return false;
  }
}

function deltaMillis([psecs, pnanos], [nsecs, nnanos]) {
  return (nsecs - psecs) * 1000 + (nnanos - pnanos) / 1000000;
}

function next(ptime) {
  const ntime = process.hrtime();
  const mDiff = deltaMillis(ptime, ntime);

  const beatDiff = (scheduler.bpm / 60000) * mDiff;
  scheduler.beat += beatDiff;
  if (scheduler.beat > scheduler.beatsInBar) {
    scheduler.beat -= scheduler.beatsInBar;
  }

  const running = scheduler.scheduled.slice(0);
  scheduler.scheduled = [];

  running
    .map(s => {
      if (!s.active) {
        s.wait = 0;
        return s;
      }
      s.wait -= beatDiff;
      if (s.wait <= 0) {
        interpretLambda(s.callback, scheduler.interpreterState);
        if (s.type === 'repeat') {
          s.wait += s.interval;
        }
      }
      return s;
    })
    .filter(s => s.wait > 0)
    .forEach(s => scheduler.scheduled.push(s));
  setTimeout(next, 10, ntime);
}

export function addScheduledEvent(interval, type, callback) {
  const id = scheduler.eventID;
  scheduler.eventID += 1;
  scheduler.scheduled.push({
    id,
    type,
    interval,
    wait: interval,
    callback,
    active: true,
  });
  return id;
}

export function removeScheduledEvent(id) {
  scheduler.scheduled.forEach(s => {
    if (s.id === id) {
      s.active = false;
    }
  });
}

export function setBPM(bpm) {
  scheduler.bpm = bpm;
  return bpm;
}

export function getBPM() {
  return scheduler.bpm;
}
