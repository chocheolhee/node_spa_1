const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    password: {
        type: String
    },
    title: {
        type: String
    },
    content: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Post", postSchema);