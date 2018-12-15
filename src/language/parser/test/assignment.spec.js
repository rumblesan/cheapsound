/* global describe, it */

import parser from '../../parser';

import { Assignment, BinaryOp, Block, Num, UnaryOp, Variable } from '../../ast';

import { dedent } from 'dentist';

import assert from 'assert';

describe('Assignment', function() {
  it('process function works', function() {
    var program = 'a = 3 + 5';
    var parsed = parser.parse(program);

    var expected = Block([
      Assignment(Variable('a'), BinaryOp('+', Num(3), Num(5))),
    ]);

    assert.deepEqual(parsed, expected);
  });

  it('assignment assigns numbers', function() {
    var program = 'number = 444';
    var parsed = parser.parse(program);

    var expected = Block([Assignment(Variable('number'), Num(444))]);

    assert.deepEqual(parsed, expected);
  });

  it('assignment assigns negative numbers', function() {
    var program = 'number = -333';
    var parsed = parser.parse(program);

    var expected = Block([
      Assignment(Variable('number'), UnaryOp('-', Num(333))),
    ]);

    assert.deepEqual(parsed, expected);
  });

  it('multiple assignments assigns bigger expression', function() {
    var program = dedent(`
                         numa = 55 + 44 * 2 - 321
                         numb = numa * -33
                         numc = numa + numb
                         `);
    var parsed = parser.parse(program);

    var numa = Assignment(
      Variable('numa'),
      BinaryOp(
        '+',
        Num(55),
        BinaryOp('-', BinaryOp('*', Num(44), Num(2)), Num(321))
      )
    );
    var numb = Assignment(
      Variable('numb'),
      BinaryOp('*', Variable('numa'), UnaryOp('-', Num(33)))
    );
    var numc = Assignment(
      Variable('numc'),
      BinaryOp('+', Variable('numa'), Variable('numb'))
    );

    var expected = Block([numa, numb, numc]);

    assert.deepEqual(parsed, expected);
  });

  it('brackets work correctly in expressions', function() {
    var program = 'number = (456 + 33) * 2';
    var parsed = parser.parse(program);

    var expected = Block([
      Assignment(
        Variable('number'),
        BinaryOp('*', BinaryOp('+', Num(456), Num(33)), Num(2))
      ),
    ]);

    assert.deepEqual(parsed, expected);
  });
});
