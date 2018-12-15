import { ParserException } from 'canto34';

export default class Parser {
  initialize(tokens) {
    if (!tokens) {
      throw new ParserException('No tokens provided to the parser');
    }

    if (!(tokens instanceof Array)) {
      throw new ParserException(
        'A non-array was provided to the parser instead of a token array'
      );
    }

    this.tokens = tokens;
  }
  la1(tokenType) {
    if (this.eof()) {
      throw new ParserException(
        `No tokens available: Cannot find ${tokenType}`
      );
    }

    return this.tokens[0].type == tokenType;
  }
  lan(n, tokenType) {
    if (this.eof()) {
      throw new ParserException(
        `No tokens available: Cannot find ${tokenType}`
      );
    }

    return this.tokens[n - 1].type == tokenType;
  }
  match(tokenType) {
    if (this.eof()) {
      throw new ParserException(`Expected ${tokenType} but found EOF`);
    }

    if (!this.la1(tokenType)) {
      const { type, content, line, character } = this.tokens[0];
      throw new ParserException(
        `Expected ${tokenType} but found ${type} (${content}) at l${line}.${character}`
      );
    }

    return this.tokens.shift();
  }
  eof() {
    return this.tokens.length === 0;
  }
  expectEof() {
    if (!this.eof()) {
      const { type, line, character } = this.tokens[0];
      throw new ParserException(
        `Expected EOF but found ${type} at l${line}.${character}`
      );
    }
  }
}
