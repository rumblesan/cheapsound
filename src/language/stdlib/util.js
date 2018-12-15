import { MODULE } from '../ast/types';

export function defModule(s, setup, name, vars) {
  const values = {};
  setup(values);
  s[name] = {
    type: MODULE,
    values,
  };
  vars.forEach(v => (s[v] = values[v]));
}

export function addFunc(s, name, func) {
  s[name] = {
    type: 'builtin',
    func,
  };
}

export function addVar(s, name, value) {
  s[name] = value;
}
