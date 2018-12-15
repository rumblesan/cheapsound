import * as canto34 from 'canto34';

const types = canto34.StandardTokenTypes;

const lexer = new canto34.Lexer({ languageName: 'cheapsound' });

const comment = () => ({
  name: 'comment',
  ignore: true,
  regexp: /^\/\/[^\n]*/,
});

const newline = () => ({
  name: 'newline',
  regexp: /^\n[ \n]*/,
});

const identifier = () => ({
  name: 'identifier',
  regexp: /^[a-zA-Z][a-zA-Z0-9]*/,
});

const operator = () => ({
  name: 'operator',
  regexp: /^[|&!<=>^%*/+-]+/,
});

const comparrisonOperator = () => ({
  name: 'operator',
  regexp: /^==/,
});

lexer.addTokenType(types.whitespace());
lexer.addTokenType(newline());
lexer.addTokenType(comment());

lexer.addTokenType(types.constant('.', 'accessor'));
lexer.addTokenType(types.constant('if', 'if'));
lexer.addTokenType(types.constant('import', 'import'));
lexer.addTokenType(types.constant('from', 'from'));
lexer.addTokenType(types.constant('as', 'as'));
lexer.addTokenType(types.constant('else', 'else'));
lexer.addTokenType(types.constant('loop', 'loop'));
lexer.addTokenType(types.constant('times', 'times'));
lexer.addTokenType(types.constant('with', 'with'));
lexer.addTokenType(types.constant('return', 'return'));
lexer.addTokenType(types.constant('=>', 'function arrow'));

// needs to come before assignment
lexer.addTokenType(comparrisonOperator());
lexer.addTokenType(types.constant('=', 'assignment'));

lexer.addTokenType(types.comma());
lexer.addTokenType(types.openParen());
lexer.addTokenType(types.closeParen());
lexer.addTokenType(types.openBracket());
lexer.addTokenType(types.closeBracket());
lexer.addTokenType(types.openSquareBracket());
lexer.addTokenType(types.closeSquareBracket());

lexer.addTokenType(operator());

lexer.addTokenType(types.floatingPoint());
lexer.addTokenType(types.integer());

lexer.addTokenType(identifier());

export default lexer;
