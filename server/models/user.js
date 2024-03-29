const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    bio: {type: String, required: true, default: 'No Bio'},
    followers: [{type: Schema.Types.ObjectId, ref: "User"}],
    following: [{type: Schema.Types.ObjectId, ref: "User"}],
    likes: [{type: Schema.Types.ObjectId, ref: "Post"}],
    user: [{type: Schema.Types.ObjectId, ref: "User"}],
});

module.exports = mongoose.model("User", UserSchema);