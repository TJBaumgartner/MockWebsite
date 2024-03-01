const Post = require('../models/posts')
const User = require('../models/user')
const Comment = require('../models/comments')
const asyncHandler = require("express-async-handler");

exports.comments_get = asyncHandler(async (req, res, next) => {
    console.log(req.params.id)
    const comments = await Post.find({_id: req.params.id}).populate('comment').populate({path: 'comment', populate : {path: 'user'}}).populate('user').sort({createdAt: -1}).exec()
    if(comments == null){
        res.sendStatus(401)
    }
    console.log(comments)
    res.json(comments)
});
exports.post_reply = asyncHandler(async (req, res, next) => {
    console.log(req.body)
    const post = await Post.findOne({_id: req.body.currentPostId});
    if(post == null){
        res.status(400).json('Post does not exist')
    }
    const comment = new Comment({
        message: req.body.message,
        likes: 0,
        post: req.body.currentPostId,
        user: req.body.user,
    })
    await Promise.all([
        comment.save(),
        
        Post.findByIdAndUpdate(
            {_id: req.body.currentPostId }, 
            {$push: {comment: comment}}
        )
    ])
    res.sendStatus(200)
})