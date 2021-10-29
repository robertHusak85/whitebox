'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const env = require('dotenv');
const rateRoutes = require('./routes/ratesRoutes');

const ApplicationError = require('./applicationError');

env.config({path: './config.env'});
console.log(`NODE_ENV: ${process.env.DATABASE_NAME}`);

const app = express();
if (process.env.DATABASE_NAME === 'dev'){
    app.use(morgan('dev'));
    console.log('dev logging enabled');
}

app.enable(" trust proxy");
app.use(cors());
app.options('*', cors());

app.use('/api/v1/rates', rateRoutes);

app.all('*', (req, res, next) => {
    next (new ApplicationError(`Unable to find ${req.originalUrl} on this server.`, 404));
});

module.exports = app;