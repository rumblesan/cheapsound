import { ParserException } from 'canto34';

import Parser from '../util/parser';
import lexer from './lexer';

import * as ast from '../ast';
import * as astTypes from '../ast/types';

class ArithmaticShunter {
  constructor() {
    this.operatorStack = [];
    this.output = [];
    this.precedences = {
      '^': 15,
      '*': 14,
      '/': 14,
      '%': 14,
      '+': 13,
      '-': 13,
      '<': 11,
      '<=': 11,
      '>': 11,
      '>=': 11,
      '==': 10,
      '!=': 10,
      '&&': 6,
      '||': 5,
    };
  }
  shuntValue(value) {
    this.output.push(value);
  }
  collapseOp(op) {
    const v2 = this.output.pop();
    const v1 = this.output.pop();
    const expr = ast.BinaryOp(op, v1, v2);
    this.output.push(expr);
  }
  shuntOp(newOp) {
    if (!this.precedences[newOp]) {
      throw new ParserException(`${newOp} is not a valid operator`);
    }
    const peekOp = this.operatorStack[this.operatorStack.length - 1];
    if (this.precedences[newOp] <= this.precedences[peekOp]) {
      const topOp = this.operatorStack.pop();
      this.collapseOp(topOp);
    }
    this.operatorStack.push(newOp);
  }
  getOutput() {
    while (this.operatorStack.length > 0) {
      this.collapseOp(this.operatorStack.pop());
    }
    if (this.output.length !== 1) {
      throw new ParserException(
        'Should only be a single expression in shunter output'
      );
    }
    return this.output.pop();
  }
}

const parser = new Parser();

parser.program = function() {
  return this.block();
};

parser.block = function() {
  const result = [];
  while (!this.eof() && !this.la1('close bracket')) {
    if (this.la1('newline')) {
      this.match('newline');
    } else {
      result.push(this.statement());
    }
  }
  return ast.Block(result);
};

parser.statement = function() {
  if (this.la1('return')) {
    this.match('return');
    const expr = this.expression();
    return ast.Return(expr);
  }
  if (this.la1('if')) {
    return this.ifStatement();
  }
  if (this.tokens.length > 1 && this.lan(2, 'assignment')) {
    return this.assignment();
  }
  if (this.la1('import')) {
    return this.importStatement();
  }
  return this.expression();
};

parser.assignment = function() {
  const name = this.match('identifier').content;
  this.match('assignment');
  const expr = this.expression();
  return ast.Assignment(ast.Variable(name), expr);
};

parser.importStatement = function() {
  this.match('import');
  let varList = [];
  if (this.la1('open paren')) {
    this.match('open paren');
    varList = this.varList();
    this.match('close paren');
    this.match('from');
  }
  const name = this.match('identifier').content;
  let alias = '';
  if (!this.eof() && this.la1('as')) {
    this.match('as');
    alias = this.match('identifier').content;
  }
  return ast.Import(name, varList, alias);
};

parser.varList = function() {
  const l = [];
  if (this.la1('close paren')) {
    return l;
  }
  l.push(this.match('identifier').content);
  while (this.la1('comma')) {
    this.match('comma');
    l.push(this.match('identifier').content);
  }
  return l;
};

// TODO handle elseif
parser.ifStatement = function() {
  this.match('if');
  const predicate = this.expression();
  this.match('open bracket');
  this.match('newline');
  const ifBlock = this.block();
  this.match('close bracket');
  if (!this.eof() && this.la1('else')) {
    this.match('else');
    this.match('open bracket');
    this.match('newline');
    const elseBlock = this.block();
    this.match('close bracket');
    return ast.If(predicate, ifBlock, elseBlock);
  }
  return ast.If(predicate, ifBlock);
};

parser.exprList = function() {
  const args = [];
  if (this.la1('close paren')) {
    return args;
  }
  args.push(this.expression());
  while (this.la1('comma')) {
    this.match('comma');
    args.push(this.expression());
  }
  return args;
};

parser.expression = function() {
  let expr = this.baseExpression();
  if (!this.eof() && this.la1('operator')) {
    expr = this.arithmatic(expr);
  }
  return expr;
};

parser.baseExpression = function() {
  let expr;
  if (this.la1('open square bracket')) {
    expr = this.list();
  } else if (this.la1('floating point')) {
    expr = ast.Num(this.match('floating point').content);
  } else if (this.la1('integer')) {
    expr = ast.Num(this.match('integer').content);
  } else if (this.la1('operator')) {
    expr = ast.UnaryOp(this.match('operator').content, this.expression());
  } else if (this.la1('identifier')) {
    expr = ast.Variable(this.match('identifier').content);
    if (this.eof()) {
      return expr;
    }
    if (this.la1('accessor')) {
      expr = this.accessor(expr);
    }
    if (this.la1('open paren')) {
      this.match('open paren');
      const args = this.exprList();
      this.match('close paren');
      expr = ast.Application(expr, args);
    }
  } else if (this.la1('open paren')) {
    this.match('open paren');
    const exprList = this.exprList();
    this.match('close paren');

    if (!this.eof() && this.la1('function arrow')) {
      expr = this.lambda(exprList);
    } else {
      if (exprList.length <= 0) {
        throw new ParserException(
          'Cannot have an empty parenthesised expression'
        );
      }
      if (exprList.length >= 2) {
        throw new ParserException('No support for tuples, sorry');
      }
      expr = exprList[0];
    }
  } else {
    const { type, content, line, character } = this.tokens[0];
    throw new ParserException(
      `Could not parse Expression on ${type} (${content}) at l${line}.${character}`
    );
  }

  while (!this.eof() && this.la1('open square bracket')) {
    expr = this.deindex(expr);
  }

  return expr;
};

parser.accessor = function(expr) {
  this.match('accessor');
  const accessorName = this.match('identifier').content;
  return ast.Accessor(expr, accessorName);
};

parser.deindex = function(expr) {
  this.match('open square bracket');
  const deIndexExpr = this.expression();
  this.match('close square bracket');
  return ast.DeIndex(expr, deIndexExpr);
};

parser.arithmatic = function(firstExpr) {
  const shunter = new ArithmaticShunter();
  shunter.shuntValue(firstExpr);
  while (!this.eof() && this.la1('operator')) {
    shunter.shuntOp(this.match('operator').content);
    shunter.shuntValue(this.baseExpression());
  }
  return shunter.getOutput();
};

parser.list = function() {
  this.match('open square bracket');
  const exprs = this.exprList();
  this.match('close square bracket');
  return ast.List(exprs);
};

const exprListToArgs = exprList => {
  return exprList.map(e => {
    if (e.type !== astTypes.VARIABLE) {
      throw new ParserException(
        `Lambda definition args should not be expressions but found ${e.type}`
      );
    }
    return e.identifier;
  });
};

parser.lambda = function(exprList) {
  const argList = exprListToArgs(exprList);
  this.match('function arrow');
  this.match('open bracket');
  if (this.la1('newline')) {
    const block = this.block();
    this.match('close bracket');
    return ast.Lambda(argList, block);
  } else {
    const expr = this.expression();
    this.match('close bracket');
    return ast.Lambda(argList, expr);
  }
};

parser.nameList = function() {
  const names = [];
  if (this.la1('close paren')) {
    return names;
  }
  names.push(this.match('identifier').content);
  while (this.la1('comma')) {
    this.match('comma');
    names.push(this.match('identifier').content);
  }
  return names;
};

parser.parse = function(program) {
  const tokens = lexer.tokenize(program);
  this.initialize(tokens);
  return this.program();
};

export default parser;
