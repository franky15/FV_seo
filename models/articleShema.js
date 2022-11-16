const mongoose = require("mongoose");

const articleSchema = mongoose.Schema({
    title: {type: String, required: true},
    article: {type: String, required: true},
    reviews: {type: String},
    ranks: {type: Number},
    likes: {type: Number},
    dislikes: {type: Number},
    usersLiked: {type: [String]},
    usersDisliked: {type:  [String]}
});

module.exports = mongoose.model("Article", articleSchema)