import {
  ACCESSOR,
  APPLICATION,
  ASSIGNMENT,
  BINARYOP,
  BLOCK,
  DEINDEX,
  IF,
  IMPORT,
  LAMBDA,
  LIST,
  MODULE,
  NUMBER,
  NULL,
  RETURN,
  UNARYOP,
  VARIABLE,
} from './ast/types';

import { importModule } from './stdlib';

function exists(node) {
  return node.type !== NULL;
}

function createChildScope(parentScope) {
  return Object.create(parentScope);
}

export const internal = {};

export function interpret(programBlock, globalscope) {
  const value = internal.evaluate(programBlock, globalscope);
  return { exitCode: 0, value };
}

export function stepInterpret(program, globalscope) {
  if (program.type !== BLOCK) {
    const value = internal.evaluate(program, globalscope);
    return { exitCode: 1, value };
  }

  var output = null;
  for (let i = 0; i < program.elements.length; i += 1) {
    const el = program.elements[i];
    output = internal.evaluate(el, globalscope);
    if (el.type === RETURN) {
      break;
    }
  }

  return { exitCode: 0, value: output };
}

export function interpretLambda(node) {
  if (node.type !== 'lambda') {
    throw `Expected lambda but got: ${node.type}`;
  }
  return node.func();
}

internal.evaluate = function(node, scope) {
  var output;

  switch (node.type) {
    case BLOCK:
      output = internal.evaluateBlock(node, scope);
      break;

    case ACCESSOR:
      output = internal.evaluateAccessor(node, scope);
      break;

    case ASSIGNMENT:
      output = internal.evaluateAssignment(node, scope);
      break;

    case APPLICATION:
      output = internal.evaluateApplication(node, scope);
      break;

    case IF:
      output = internal.evaluateIf(node, scope);
      break;

    case IMPORT:
      output = internal.evaluateImport(node, scope);
      break;

    case LAMBDA:
      output = internal.evaluateLambda(node, scope);
      break;

    case BINARYOP:
      output = internal.evaluateBinaryOp(node, scope);
      break;

    case UNARYOP:
      output = internal.evaluateUnaryOp(node, scope);
      break;

    case NUMBER:
      output = node.value;
      break;

    case VARIABLE:
      output = internal.evaluateVariable(node, scope);
      break;

    case DEINDEX:
      output = internal.evaluateDeIndex(node, scope);
      break;

    case RETURN:
      output = internal.evaluate(node.value, scope);
      break;

    case LIST:
      output = node.values.map(v => {
        return internal.evaluate(v, scope);
      });
      break;

    default:
      throw `Unknown AST Type: ${node.type}`;
  }

  return output;
};

internal.evaluateBlock = function(block, scope) {
  var childScope = createChildScope(scope);
  var output = null;
  var i, el;
  for (i = 0; i < block.elements.length; i += 1) {
    el = block.elements[i];
    output = internal.evaluate(el, childScope);
    if (el.type === RETURN) {
      return output;
    }
  }

  return output;
};

internal.evaluateAssignment = function(assignment, scope) {
  var value = internal.evaluate(assignment.expression, scope);
  scope[assignment.variable.identifier] = value;
  return value;
};

internal.evaluateApplication = function(application, scope) {
  var func, args, evaledargs, output, i;

  func = internal.evaluate(application.func, scope);
  if (!exists(func)) {
    throw 'Cannot evaluate NULL function';
  }

  evaledargs = [];

  args = application.args;

  for (i = 0; i < args.length; i += 1) {
    evaledargs.push(internal.evaluate(args[i], scope));
  }

  // functions are wrapped in an object with a function type
  // to differentiate between builtins and lambdas
  // user defined functions will be wrapped in a list so we unwrap them then call them
  if (func.type === 'builtin') {
    // apply is a method of the JS function object. it takes a scope
    // and then a list of arguments
    // eg
    //
    // var foo = function (a, b) {
    //     return a + b;
    // }
    //
    // var bar = foo.apply(window, [2, 3]);
    //
    // bar will equal 5

    output = func.func.apply(scope, evaledargs);
  } else if (func.type === 'lambda') {
    // Functions defined by the user are wrapped in a list, so we need
    // to unwrap them
    // Also we don't pass the scope in because everything is created
    // as a lambda
    output = func.func(evaledargs);
  } else {
    throw 'Error interpreting function';
  }

  return output;
};

internal.evaluateIf = function(ifStatement, scope) {
  var predicate, ifblock, elseblock;

  predicate = ifStatement.predicate;
  ifblock = ifStatement.ifBlock;
  elseblock = ifStatement.elseBlock;

  if (internal.evaluate(predicate, scope)) {
    internal.evaluateBlock(ifblock, scope);
  } else if (exists(elseblock)) {
    internal.evaluateIf(elseblock, scope);
  }
};

internal.evaluateImport = function(importStatement, scope) {
  importModule(importStatement, scope);
};

internal.evaluateLambda = function(lambda, scope) {
  var argnames, body, func;
  argnames = lambda.argNames;
  body = lambda.body;

  func = function(argvalues) {
    var i, childScope, output;
    childScope = createChildScope(scope);
    for (i = 0; i < argnames.length; i += 1) {
      childScope[argnames[i]] = argvalues[i];
    }
    output = internal.evaluate(body, childScope);
    return output;
  };

  // Return the function wrapped in an object with the function
  // type set to be lambda
  return {
    type: 'lambda',
    func: func,
  };
};

internal.evaluateUnaryOp = function(operation, scope) {
  var output;
  var val1 = internal.evaluate(operation.expr1, scope);

  switch (operation.operator) {
    case '-':
      output = -1 * val1;
      break;

    case '!':
      output = !val1;
      break;

    default:
      throw 'Unknown Operator: ' + operation.operator;
  }

  return output;
};

internal.evaluateBinaryOp = function(binaryOp, scope) {
  var output;
  var val1 = internal.evaluate(binaryOp.expr1, scope);
  var val2 = internal.evaluate(binaryOp.expr2, scope);

  switch (binaryOp.operator) {
    case '+':
      output = val1 + val2;
      break;

    case '-':
      output = val1 - val2;
      break;

    case '*':
      output = val1 * val2;
      break;

    case '/':
      output = val1 / val2;
      break;

    case '^':
      output = Math.pow(val1, val2);
      break;

    case '%':
      output = val1 % val2;
      break;

    case '>':
      output = val1 > val2;
      break;

    case '<':
      output = val1 < val2;
      break;

    case '>=':
      output = val1 >= val2;
      break;

    case '<=':
      output = val1 <= val2;
      break;

    case '==':
      output = val1 === val2;
      break;

    case '&&':
      output = val1 && val2;
      break;

    case '||':
      output = val1 || val2;
      break;

    default:
      throw 'Unknown Operator: ' + binaryOp.operator;
  }

  return output;
};

internal.evaluateVariable = function(variable, scope) {
  var output = scope[variable.identifier];
  if (output === undefined) {
    throw 'Undefined Variable: ' + variable.identifier;
  }
  return output;
};

internal.evaluateAccessor = function(accessor, scope) {
  const target = internal.evaluate(accessor.target, scope);
  if (target.type !== MODULE) {
    throw 'Can only access modules';
  }
  return target.values[accessor.name];
};

internal.evaluateDeIndex = function(deindex, scope) {
  var collection = internal.evaluate(deindex.collection, scope);
  if (!Array.isArray(collection)) {
    throw 'Must deindex lists';
  }
  var index = internal.evaluate(deindex.index, scope);
  if (Number.isNaN(index)) {
    throw 'Index must be a number';
  }
  var output = collection[index];
  return output;
};
