import express from 'express';
import bodyParser from 'body-parser';

import languageParser from './language/parser';
import * as scheduler from './language/runtime/scheduler';
import { stepInterpret } from './language/interpreter';
import * as stdlib from './language/stdlib';

import * as logger from './logging';

const app = express();
app.use(bodyParser.text({ type: 'text/cheapsound' }));

const port = 3000;

const langstate = {};
stdlib.setup(langstate);

scheduler.start(langstate);

app.get('/', (req, res) => res.send('Hello, World!'));
app.post('/run', (req, res) => {
  const ast = languageParser.parse(req.body);
  const out = stepInterpret(ast, langstate);
  res.send(`${out.value}`);
});

app.listen(port, () => logger.info(`Listening on port ${port}`));
