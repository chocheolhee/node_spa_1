const express = require('express');
const app = express();
const port = 3000;
const connect = require("./schemas");
const postRoutes = require('./routes/posts')
const commentRoutes = require('./routes/comments')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/posts',postRoutes)
app.use('/api/comments',commentRoutes)

// app.get('/', (req, res) => {
//     res.send('hi!');
// });

connect(); // mongoose connection
app.listen(port, () => {
    console.log(port, 'server start');
});