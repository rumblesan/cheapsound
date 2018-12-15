/* global describe, it, xit */

import parser from '../../parser';

import {
  Application,
  Assignment,
  BinaryOp,
  Block,
  If,
  Num,
  Variable,
} from '../../ast';

import { dedent } from 'dentist';

import assert from 'assert';

describe('If', function() {
  it('simple if statement parses', function() {
    var program = dedent(`
                         a = 3

                         if (a == 3) {
                           box()
                         }
                         `);
    var parsed = parser.parse(program);

    var expected = Block([
      Assignment(Variable('a'), Num(3)),
      If(
        BinaryOp('==', Variable('a'), Num(3)),
        Block([Application(Variable('box'), [])])
      ),
    ]);

    assert.deepEqual(parsed, expected);
  });

  it('if else statement parses', function() {
    var program = dedent(`
                         a = 3
                         if (a == 3) {
                           box()
                         } else {
                           peg()
                         }`);
    var parsed = parser.parse(program);

    var expected = Block([
      Assignment(Variable('a'), Num(3)),
      If(
        BinaryOp('==', Variable('a'), Num(3)),
        Block([Application(Variable('box'), [])]),
        Block([Application(Variable('peg'), [])])
      ),
    ]);

    assert.deepEqual(parsed, expected);
  });

  // Skipping until elseif is supported
  xit('if ifelse else statement parses', function() {
    var program = dedent(`
                         a = 3
                         if (a == 1) {
                           box()
                         } else if (a == 2) {
                           ball()
                         } else {
                           peg()
                         }
                         `);
    var parsed = parser.parse(program);

    var expected = Block([
      Assignment(Variable('a'), Num(3)),
      If(
        BinaryOp('==', Variable('a'), Num(1)),
        Block([Application(Variable('box'), [])]),
        If(
          BinaryOp('==', Variable('a'), Num(2)),
          Block([Application(Variable('ball'), [])]),
          If(Num(1), Block([Application(Variable('peg'), [])]))
        )
      ),
    ]);

    assert.deepEqual(parsed, expected);
  });
});
