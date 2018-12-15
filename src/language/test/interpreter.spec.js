/* global describe, it */

import { interpret, stepInterpret } from '../interpreter';
import parser from '../parser';
import {
  Application,
  Assignment,
  BinaryOp,
  Block,
  Lambda,
  Num,
  Variable,
} from '../ast';
import { addFunc, addVar } from '../stdlib/util';

import { dedent } from 'dentist';

import assert from 'assert';

describe('Interpreter', function() {
  it('evaluate simple expression', function() {
    var output;
    var scope = {};
    addFunc(scope, 'result', v => {
      output = v;
    });

    var program = parser.parse('result(3 + 4 * 2)');
    interpret(program, scope);

    assert.equal(output, 11, 'should return 11');
  });

  it('evaluate expression with variable', function() {
    var output;
    var scope = {};
    addFunc(scope, 'result', v => {
      output = v;
    });
    addVar(scope, 'foo', 4);

    var program = parser.parse(
      dedent(`
             a = foo + 1
             result((a + 4) * foo)`)
    );
    interpret(program, scope);

    assert.equal(output, 36, 'output should be 36');
  });

  it('function definition and usage', function() {
    var output;
    var scope = {};
    addFunc(scope, 'result', v => {
      output = v;
    });

    var program = parser.parse(
      dedent(`
             //the first function
             a = (x) => { x * 2 }
             //another function
             b = (x, y) => { x + y }
             result(b(a(2), 3) +  a( 1 ))
             `)
    );

    var expected = Block([
      Assignment(
        Variable('a'),
        Lambda(['x'], BinaryOp('*', Variable('x'), Num(2)))
      ),
      Assignment(
        Variable('b'),
        Lambda(['x', 'y'], BinaryOp('+', Variable('x'), Variable('y')))
      ),
      Application(Variable('result'), [
        BinaryOp(
          '+',
          Application(Variable('b'), [
            Application(Variable('a'), [Num(2)]),
            Num(3),
          ]),
          Application(Variable('a'), [Num(1)])
        ),
      ]),
    ]);

    assert.deepEqual(program, expected);

    interpret(program, scope);

    assert.equal(output, 9, `output should be 9 not ${output}`);
  });

  it('does now allow closures to modify externally scoped variables', function() {
    var output;
    var scope = {};
    addFunc(scope, 'result', v => {
      output = v;
    });

    var program = parser.parse(
      dedent(`
             a = 0
             b = (x) => {
               a = a + 1
               return a + x
             }
             b(0)
             b(0)
             c = b(0)
             result(c)
             `)
    );
    interpret(program, scope);

    assert.equal(output, 1, `output should be 1 not ${output}`);
  });

  it('keeps scope between step interpreter runs', function() {
    var output;
    var scope = {};
    addFunc(scope, 'result', v => {
      output = v;
    });

    stepInterpret(parser.parse('a = 1 + 2'), scope);
    stepInterpret(parser.parse('b = a + 1'), scope);
    stepInterpret(parser.parse('c = b + a'), scope);
    stepInterpret(parser.parse('result(c)'), scope);

    assert.equal(output, 7, 'should return 8');
  });
});
