const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    message: {type: String, required: true},
    likes: {type: Number, required: true, default: 0},
    date: {type: Date, default: Date.now()},
    user: [{type: Schema.Types.ObjectId, ref: "User"}],
});

module.exports = mongoose.model("Post", PostSchema);