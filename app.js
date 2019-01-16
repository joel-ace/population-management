import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

import routesV1 from './server/routes/v1';

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/api/v1', routesV1);

app.use('*', (req, res) => (
  res.status(404).send({
    message: 'this resource does not exist or has been previously deleted',
  })
));

if (process.env.NODE_ENV !== 'test') {
  app.listen(port);
}

export default app;
