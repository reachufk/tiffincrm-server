const express = require('express')
const app = express();
var cors = require('cors');
var mongoose = require("mongoose")
var bodyParser = require('body-parser');
var config = require('../config/config');
const UserController = require('./controllers/user/user-controller')
const compression = require('compression');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());
mongoose.set("strictQuery", false);
mongoose.connect(config.databaseConnection,
      { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("connection to database sucessfully."))
      .catch((error) => console.log(error));


module.exports = app
