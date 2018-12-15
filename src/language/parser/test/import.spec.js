/* global describe, it */

import parser from '../../parser';

import { Block, Import } from '../../ast';

import assert from 'assert';

describe('Imports', function() {
  it('allows basic imports', function() {
    var program = 'import midi';
    var parsed = parser.parse(program);

    var expected = Block([Import('midi', [], '')]);

    assert.deepEqual(parsed, expected);
  });

  it('allows aliased imports', function() {
    var program = 'import midi as m';
    var parsed = parser.parse(program);

    var expected = Block([Import('midi', [], 'm')]);

    assert.deepEqual(parsed, expected);
  });

  it('allows specific import vars', function() {
    var program = 'import (play) from midi';
    var parsed = parser.parse(program);

    var expected = Block([Import('midi', ['play'], '')]);

    assert.deepEqual(parsed, expected);
  });
});
