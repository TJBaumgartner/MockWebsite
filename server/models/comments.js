const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    message: {type: String, required: true},
    likes: {type: Number, required: true, default: 0},
    post: [{type: Schema.Types.ObjectId, ref: "Post"}],
    user: [{type: Schema.Types.ObjectId, ref: "User"}],
},
{ timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);