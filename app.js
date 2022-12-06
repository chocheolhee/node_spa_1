const express = require('express');
const app = express();
const apiRoute = require("./routes");
const {sequelize} = require("./models");
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output");

require('dotenv').config();
const port = process.env.PORT || 3000

sequelize.sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'))
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use('/api', apiRoute);

// connect(); // mongoose connection
app.listen(port, () => {
    console.log(port, 'server start');
});