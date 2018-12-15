/* global describe, it */

import parser from '../../parser';

import {
  Application,
  Assignment,
  BinaryOp,
  Block,
  Lambda,
  If,
  Num,
  Variable,
} from '../../ast';

import { dedent } from 'dentist';

import assert from 'assert';

describe('Function', function() {
  it('expression function with one argument is parsed', function() {
    var program = 'foo = (a) => { a + 1 }';
    var parsed = parser.parse(program);

    var expected = Block([
      Assignment(
        Variable('foo'),
        Lambda(['a'], BinaryOp('+', Variable('a'), Num(1)))
      ),
    ]);

    assert.deepEqual(parsed, expected);
  });

  it('expression function is parsed', function() {
    var program = dedent(`
                         foo = (a, b) => { a + b }
                         `);
    var parsed = parser.parse(program);

    var expected = Block([
      Assignment(
        Variable('foo'),
        Lambda(['a', 'b'], BinaryOp('+', Variable('a'), Variable('b')))
      ),
    ]);

    assert.deepEqual(parsed, expected);
  });

  it('lambda can be used ok', function() {
    var program = dedent(`
                         foo = () => { 255 * random() }
                         fill(foo())
                         box()
                         `);
    var parsed = parser.parse(program);

    var expected = Block([
      Assignment(
        Variable('foo'),
        Lambda([], BinaryOp('*', Num(255), Application(Variable('random'), [])))
      ),
      Application(Variable('fill'), [Application(Variable('foo'), [])]),
      Application(Variable('box'), []),
    ]);

    assert.deepEqual(parsed, expected);
  });

  it('simple function call is parsed', function() {
    var program = 'box(1)';
    var parsed = parser.parse(program);

    var expected = Block([Application(Variable('box'), [Num(1)])]);

    assert.deepEqual(parsed, expected);
  });

  it('simple function call with empty arg list is parsed', function() {
    var program = 'box()';
    var parsed = parser.parse(program);

    var expected = Block([Application(Variable('box'), [])]);

    assert.deepEqual(parsed, expected);
  });

  it('block function is parsed', function() {
    var program = dedent(`
                         bar = (a, b) => {
                           c = a + b
                           box(c, 3)
                         }
                         `);
    var parsed = parser.parse(program);

    var expected = Block([
      Assignment(
        Variable('bar'),
        Lambda(
          ['a', 'b'],
          Block([
            Assignment(
              Variable('c'),
              BinaryOp('+', Variable('a'), Variable('b'))
            ),
            Application(Variable('box'), [Variable('c'), Num(3)]),
          ])
        )
      ),
    ]);

    assert.deepEqual(parsed, expected);
  });

  it('block function with if is parsed', function() {
    var program = dedent(`
                         bar = (a, b) => {
                           if (a > b) {
                             box(a)
                           } else {
                             box(b)
                           }
                         }
                         `);
    var parsed = parser.parse(program);

    var expected = Block([
      Assignment(
        Variable('bar'),
        Lambda(
          ['a', 'b'],
          Block([
            If(
              BinaryOp('>', Variable('a'), Variable('b')),
              Block([Application(Variable('box'), [Variable('a')])]),
              Block([Application(Variable('box'), [Variable('b')])])
            ),
          ])
        )
      ),
    ]);

    assert.deepEqual(parsed, expected);
  });

  it('expression function is parsed then used', function() {
    var program = dedent(`
                         foo = (a) => { a + 3 }
                         bar = foo(1 + foo(2))
                         `);
    var parsed = parser.parse(program);

    var expected = Block([
      Assignment(
        Variable('foo'),
        Lambda(['a'], BinaryOp('+', Variable('a'), Num(3)))
      ),
      Assignment(
        Variable('bar'),
        Application(Variable('foo'), [
          BinaryOp('+', Num(1), Application(Variable('foo'), [Num(2)])),
        ])
      ),
    ]);

    assert.deepEqual(parsed, expected);
  });

  it('complex expression function is parsed', function() {
    var program =
      'foo = (x, y, j, z) => { spread * (  ( noise(x * abs(sin(time+y) * movmentSpeed)) / (j + z) ) - 0.5  ) }';

    var parsed = parser.parse(program);

    var expected = Block([
      Assignment(
        Variable('foo'),
        Lambda(
          ['x', 'y', 'j', 'z'],
          BinaryOp(
            '*',
            Variable('spread'),
            BinaryOp(
              '-',
              BinaryOp(
                '/',
                Application(Variable('noise'), [
                  BinaryOp(
                    '*',
                    Variable('x'),
                    Application(Variable('abs'), [
                      BinaryOp(
                        '*',
                        Application(Variable('sin'), [
                          BinaryOp('+', Variable('time'), Variable('y')),
                        ]),
                        Variable('movmentSpeed')
                      ),
                    ])
                  ),
                ]),
                BinaryOp('+', Variable('j'), Variable('z'))
              ),
              Num(0.5)
            )
          )
        )
      ),
    ]);

    assert.deepEqual(parsed, expected);
  });

  it('application call with single expression args', function() {
    var program = 'box(3 + 4 + 2)';
    var parsed = parser.parse(program);

    var expected = Block([
      Application(Variable('box'), [
        BinaryOp('+', BinaryOp('+', Num(3), Num(4)), Num(2)),
      ]),
    ]);

    assert.deepEqual(parsed, expected);
  });
});
