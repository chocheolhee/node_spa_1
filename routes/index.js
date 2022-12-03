const express = require('express');
const postRoutes = require("./posts");
const commentRoutes = require("./comments");
const authRoutes = require("./auth");

const router = express.Router();

router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/auth', authRoutes);

module.exports= router;