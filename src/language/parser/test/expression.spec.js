/* global describe, it */

import parser from '../../parser';

import {
  Accessor,
  Application,
  Assignment,
  Block,
  DeIndex,
  List,
  Num,
  Variable,
} from '../../ast';

import { dedent } from 'dentist';

import assert from 'assert';

describe('Expressions', function() {
  it('deindexes correctly', function() {
    var program = dedent(`
                         a = [1,2,3]
                         b = a[0]
                         `);
    var parsed = parser.parse(program);

    var expected = Block([
      Assignment(Variable('a'), List([Num(1), Num(2), Num(3)])),
      Assignment(Variable('b'), DeIndex(Variable('a'), Num(0))),
    ]);

    assert.deepEqual(parsed, expected);
  });

  it('accesses correctly', function() {
    var program = 'b.foo()';
    var parsed = parser.parse(program);

    var expected = Block([Application(Accessor(Variable('b'), 'foo'), [])]);

    assert.deepEqual(parsed, expected);
  });
});
