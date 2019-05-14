const dotenv = require('dotenv').config({
  silent: process.env.NODE_ENV === 'production',
});

const PORT = process.env.PORT || 9090;

const package = require('./package.json');
const debug = require('debug')(`${package.name}:index`);
const express = require('express');
const hbs = require('express-hbs');
const path = require('path');
const app = express();
const helmet = require('helmet');
const express_enforces_ssl = require('express-enforces-ssl');
const bodyParser = require('body-parser');
const core_routes = require('./routes/router');
const hbs_helpers = require('./utils/hbs-helpers');
const { getS3oUsername } = require('./helpers/cookies');

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
    partialsDir: __dirname + '/views/partials',
  }),
);

hbs_helpers.registerHelpers(hbs);

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

let requestLogger = function(req, res, next) {
  debug('RECEIVED REQUEST:', req.method, req.url);
  next();
};

// app.use(express.json());

app.use(requestLogger);
app.use('/static', express.static(path.resolve(__dirname + '/static')));
app.use('/', core_routes);

app.use(function(err, req, res, next) {
  console.log('Error:');
  console.log(err);
  res.status(404);

  if (req.accepts('html')) {
    res.render('404', {
      url: req.url,
      method: req.method,
      url: req.url,
      error: err,
      user: {
        username: getS3oUsername(req.cookies),
      },
    });
    return;
  }

  if (req.accepts('json')) {
    res.send({ msg: 'Not found', error: err });
    return;
  }

  res.type('txt').send('Not found');
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
