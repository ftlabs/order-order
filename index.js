// import { config as dotenv } from 'dotenv';

// const dotenv = dotenvModule({
//   silent: process.env.NODE_ENV === 'production',
// });

const PORT = process.env.PORT || 9090;

// import packageJson from './package.json';
// import debugModule from 'debug';
// const debug = debugModule(`${packageJson.name}:index`);
import express from 'express';
import hbs from 'express-hbs';
import path from 'path';
const app = express();
import helmet from 'helmet';
import express_enforces_ssl from 'express-enforces-ssl';
import bodyParser from 'body-parser';
import core_routes from './src/routes/router';
import hbs_helpers from './src/utils/hbs-helpers';

if (!PORT) {
  throw new Error('ERROR: PORT not specified in env');
}

if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
  app.enable('trust proxy');
  app.use(express_enforces_ssl());
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine(
  'hbs',
  hbs.express4({
    partialsDir: './src/views/partials'
  })
);

hbs_helpers.registerHelpers(hbs);

app.set('view engine', 'hbs');
app.set('views', './src/views');

let requestLogger = function(req, res, next) {
  // debug('RECEIVED REQUEST:', req.method, req.url);
  next();
};

// app.use(express.json());

app.use(requestLogger);
app.use('/static', express.static(path.resolve('./src/static')));
app.use('/', core_routes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
