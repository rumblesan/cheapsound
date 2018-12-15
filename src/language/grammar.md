# Grammar


```
start = Block

Block = EOF | Statements EOF

Statements = Statement | Statement NewLine Statements

EOF = NewLine? End | End

Statement = Assignment
          | Application
          | If
          | 'return' Return

Assignment = Identifier '=' Expression

Application = Identifier '(' ArgList? ')'

ArgList = Expression
        | Expression ',' ArgList

If = 'if' Expression OpenBracket NewLine Statements CloseBracket ElseBlock?

ElseBlock = 'else' OpenBracket NewLine Statements CloseBracket

Expression = BaseExpression
           | Arithmatic

Arithmatic = BaseExpression Operator Expression

BaseExpression = Number
               | Variable
               | List
               | DeIndex
               | '(' Expression ')'
               | UnaryOperator Expression
               | Lambda
               | Application

Lambda = '(' NameList? ')' '=>' OpenBracket NewLine Statements CloseBracket
       | '(' NameList? ')' '=>' OpenBracket Expression CloseBracket

DeIndex = BaseExpression '[' Expression ']'

Operator = '^' | '*' | '/' | '%' | '+' | '-' | '<' | '<=' | '>' | '>=' | '==' | '!=' | '&&' | '||'

UnaryOperator = '!' | '-'

NameList = Identifier | Identifier ',' NameList
```
