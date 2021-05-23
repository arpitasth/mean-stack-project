const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const colors = require('colors');

const app = express();
const postRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');

const DB_URI = 'mongodb+srv://arpit:9140632261@cluster0.ttapc.mongodb.net/demo-project?retryWrites=true&w=majority'

mongoose.connect(DB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
}).then((res) => {
  console.log('You are connected with DB'.yellow.bold)
}).catch(error => {
  console.log(error.red.bold);
});

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

app.use('/api/posts',postRoutes);
app.use('/api/user',authRoutes);

module.exports = app;
