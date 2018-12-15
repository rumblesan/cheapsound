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
} from './types';

/**
 */
export function Null() {
  return {
    type: NULL,
  };
}

/**
 *  elements: [Element]
 */
export function Block(elements) {
  return {
    type: BLOCK,
    elements,
  };
}

/**
 *  target: Expression
 *  name: Identifier
 */
export function Accessor(target, name) {
  return {
    type: ACCESSOR,
    target,
    name,
  };
}

/**
 *  variable: Variable
 *  expression: Expression
 */
export function Assignment(variable, expression) {
  return {
    type: ASSIGNMENT,
    variable,
    expression,
  };
}

/**
 *  func: Identifier
 *  args: [Expression]
 */
export function Application(func, args) {
  return {
    type: APPLICATION,
    func,
    args,
  };
}

/**
 *  predicate: Expression
 *  ifBlock:   Block
 *  elseBlock: Block
 */
export function If(predicate, ifBlock, elseBlock = Null()) {
  return {
    type: IF,
    predicate,
    ifBlock,
    elseBlock,
  };
}

/**
 *  name: Identifier
 *  vars: [Identifier]
 *  alias: Identifier
 */
export function Import(name, vars, alias) {
  return {
    type: IMPORT,
    name,
    vars,
    alias,
  };
}

/**
 *  argNames:  [Identifier]
 *  body:      Block
 *  inlinable: Boolean
 */
export function Lambda(argNames, body) {
  return {
    type: LAMBDA,
    argNames,
    body,
  };
}

/**
 *  value:  Expression
 */
export function Return(value) {
  return {
    type: RETURN,
    value,
  };
}

/**
 *  operation: String
 *  expr1: Expression
 */
export function UnaryOp(operator, expr1) {
  return {
    type: UNARYOP,
    operator,
    expr1,
  };
}

/**
 *  operation: String
 *  expr1: Expression
 *  expr2: Expression
 */
export function BinaryOp(operator, expr1, expr2) {
  return {
    type: BINARYOP,
    operator,
    expr1,
    expr2,
  };
}

/**
 *  collection: Expression
 *  index: Expression
 */
export function DeIndex(collection, index) {
  return {
    type: DEINDEX,
    collection,
    index,
  };
}

/**
 *  value: Number
 */
export function Num(value) {
  return {
    type: NUMBER,
    value,
  };
}

/**
 *  value: Identifier
 */
export function Variable(identifier) {
  return {
    type: VARIABLE,
    identifier,
  };
}

/**
 *  values: JS Object
 */
export function Module(values) {
  return {
    type: MODULE,
    values,
  };
}

/**
 *  value: List
 */
export function List(values) {
  return {
    type: LIST,
    values,
  };
}
