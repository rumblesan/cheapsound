import * as logger from '../../logging';

import { defModule } from './util';

import addStdMidiFuncs from './midi';
import addNoteLib from './note';

export function importModule({ name, vars, alias }, interpreterState) {
  switch (name) {
    case 'midi':
      logger.info(`importing midi`);
      defModule(interpreterState, addStdMidiFuncs, alias || 'midi', vars);
      break;
    case 'note':
      logger.info(`importing note`);
      defModule(interpreterState, addNoteLib, alias || 'note', vars);
      break;
  }
}
