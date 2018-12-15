/* global describe, it */

import parser from '../../parser';
import { Assignment, BinaryOp, Block, Num, UnaryOp, Variable } from '../../ast';

import { dedent } from 'dentist';

import assert from 'assert';

describe('Math', function() {
  it('negative number', function() {
    var program = 'a = -3';
    var parsed = parser.parse(program);

    var expected = Block([Assignment(Variable('a'), UnaryOp('-', Num(3)))]);

    assert.deepEqual(parsed, expected);
  });

  it('negative variable', function() {
    var program = dedent(`
                         a = 3
                         b = -a
                         `);
    var parsed = parser.parse(program);

    var expected = Block([
      Assignment(Variable('a'), Num(3)),
      Assignment(Variable('b'), UnaryOp('-', Variable('a'))),
    ]);

    assert.deepEqual(parsed, expected);
  });

  it('negative expression', function() {
    var program = 'a = -(3 + 4)';
    var parsed = parser.parse(program);

    var expected = Block([
      Assignment(Variable('a'), UnaryOp('-', BinaryOp('+', Num(3), Num(4)))),
    ]);

    assert.deepEqual(parsed, expected);
  });

  it('parenthesised expressions', function() {
    var program = 'a = (3 + 4) + 4';
    var parsed = parser.parse(program);

    var expected = Block([
      Assignment(
        Variable('a'),
        BinaryOp('+', BinaryOp('+', Num(3), Num(4)), Num(4))
      ),
    ]);

    assert.deepEqual(parsed, expected);
  });

  it('parses with correct operator precedence', function() {
    var program = 'a = 3 + 2 * 4';
    var parsed = parser.parse(program);

    var expected = Block([
      Assignment(
        Variable('a'),
        BinaryOp('+', Num(3), BinaryOp('*', Num(2), Num(4)))
      ),
    ]);

    assert.deepEqual(parsed, expected);
  });
});
