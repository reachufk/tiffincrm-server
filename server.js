const express = require('express');
const app = express();
var cors = require('cors');
var mongoose = require("mongoose")
const swaggerUi = require('swagger-ui-express');
var bodyParser = require('body-parser');
var environment = require('./config/config');
const compression = require('compression');
const swaggerDocument = require('./swagger-api-docs/swagger-doc');
const routes= require('./application/routes-domain/domain-routes')
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
mongoose.set("strictQuery", false);
mongoose.connect(environment.databaseConnection,
      { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("connection to database sucessfully."))
      .catch((error) => console.log(error));

const port = process.env.PORT || 3000;

app.use(routes);
app.listen(port, () => {
      console.log(`server is listening on port ${port}`)
})

