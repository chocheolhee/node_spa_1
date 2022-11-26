const express = require('express');
const app = express();
const connect = require("./schemas");
const apiRoute = require("./routes")

require('dotenv').config();
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', apiRoute);

connect(); // mongoose connection
app.listen(port, () => {
    console.log(port, 'server start');
});