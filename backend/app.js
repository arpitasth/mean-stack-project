const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const colors = require('colors');
const morgan = require('morgan');

const connectDB = require('./config/database');
const errorHandler  = require('./middleware/error');

// Connect DB
connectDB();

const app = express();
const postRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use(morgan('dev'));

app.use('/api/auth',authRoutes);
app.use('/api/posts',postRoutes);


app.use(errorHandler);

module.exports = app;
