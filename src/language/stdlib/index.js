import { defModule } from './util';

import addStdMidiFuncs from './midi';

export function importModule({ name, vars, alias }, interpreterState) {
  switch (name) {
    case 'midi':
      defModule(interpreterState, addStdMidiFuncs, alias || 'midi', vars);
      break;
  }
}
