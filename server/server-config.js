require('dotenv').config()
const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const organizationRouter = require('./routes/organizationRoutes');
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');

const app = express();


app.set('strict routing', true);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.options('*', cors());
app.use((req, res, next) => {
  console.log(`👉 ${req.method} ${req.originalUrl}`);
  next();
});

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/organizations', organizationRouter);
app.use('/users', userRouter);
app.use('/auth',authRouter);

module.exports = app;
