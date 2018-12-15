/* global describe, it */

import parser from '../../parser';

import { Assignment, Block, DeIndex, List, Num, Variable } from '../../ast';

import { dedent } from 'dentist';

import assert from 'assert';

describe('List', function() {
  it('basic list literal works', function() {
    var program = dedent(`
                         a = [1, 3, 5]
                         `);
    var parsed = parser.parse(program);

    var expected = Block([
      Assignment(Variable('a'), List([Num(1), Num(3), Num(5)])),
    ]);
    assert.deepEqual(parsed, expected);
  });

  it('can deindex a value from a list', function() {
    var program = dedent(`
                         a = [1, 3, 5]
                         b = a[0]
                         `);
    var parsed = parser.parse(program);

    var expected = Block([
      Assignment(Variable('a'), List([Num(1), Num(3), Num(5)])),
      Assignment(Variable('b'), DeIndex(Variable('a'), Num(0))),
    ]);
    assert.deepEqual(parsed, expected);
  });
  it('can multiple deindex', function() {
    var program = dedent(`
                         a = [[1], [3], [5]]
                         b = [[1], [3], [5]]
                         c = [a, b][0][1]
                         `);
    var parsed = parser.parse(program);

    var expected = Block([
      Assignment(
        Variable('a'),
        List([List([Num(1)]), List([Num(3)]), List([Num(5)])])
      ),
      Assignment(
        Variable('b'),
        List([List([Num(1)]), List([Num(3)]), List([Num(5)])])
      ),
      Assignment(
        Variable('c'),
        DeIndex(DeIndex(List([Variable('a'), Variable('b')]), Num(0)), Num(1))
      ),
    ]);
    assert.deepEqual(parsed, expected);
  });
});
