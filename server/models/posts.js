const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    message: {type: String, required: true},
    likes: {type: Number, required: true, default: 0},
    user: [{type: Schema.Types.ObjectId, ref: "User"}],
    comment: [{type: Schema.Types.ObjectId, ref: "Comment"}],
},
{ timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);