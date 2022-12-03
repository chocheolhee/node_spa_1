const express = require('express');
const app = express();
const connect = require("./schemas");
const apiRoute = require("./routes");
const {sequelize} = require("./models");
const cookieParser = require('cookie-parser');

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

app.use('/api', apiRoute);

connect(); // mongoose connection
app.listen(port, () => {
    console.log(port, 'server start');
});