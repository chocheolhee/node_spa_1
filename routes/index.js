const express = require('express');
const postRoutes = require("./posts");
const commentRoutes = require("./comments");

const router = express.Router();

router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

module.exports= router;