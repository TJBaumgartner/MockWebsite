const Post = require('../models/posts')
const User = require('../models/user')

const asyncHandler = require("express-async-handler");

exports.post_create_get = asyncHandler(async (req, res, next) => {
    res.sendStatus(200)
});
exports.post_create_post = asyncHandler(async(req,res,next) => {
    const user = await Post.findOne({_id: req.body.id});
    if(user == null){
        res.status(400).json('User does not exist')
    }
    const post = new Post({
        message: req.body.message,
        likes: 0,
        date: Date.now(),
        user: req.body.user
    })
    await post.save()
    res.sendStatus(200)
})

exports.post_list = asyncHandler(async (req, res, next) => {
    const posts = await Post.find({
        $or:[{user: {$in:req.body.followData}}, {user: req.body.id}]})
        .populate("user")
        .sort({createdAt: -1})
    if(posts == null){
        return res.sendStatus(401)
    }
    res.json(posts)
});

exports.like_post = asyncHandler(async (req, res, next) => {
    const [post, user] = await Promise.all([
        Post.findOne({_id: req.body.post}),
        User.findOne({_id: req.body.user}),
    ])
    if(post == null || user == null){
        return res.status(401)
    }
    if(user.likes.includes(req.body.post)){
        return res.status(400).json('already liked')
    }
    await Promise.all([
        User.findByIdAndUpdate(
            {_id: req.body.user }, 
            { $push: { likes: req.body.post}
        }),
        Post.findByIdAndUpdate(
            {_id: req.body.post }, 
            {$inc: {likes: 1}}
        )
    ])
    res.sendStatus(200)
});
exports.unlike_post = asyncHandler(async (req,res) => {
    const [post, user] = await Promise.all([
        Post.findOne({_id: req.body.post}),
        User.findOne({_id: req.body.user}),
    ])
    if(post == null || user == null){
        return res.status(401)
    }
    await Promise.all([
        User.findByIdAndUpdate(
            {_id: req.body.user }, 
            { $pull: { likes: req.body.post}
        }),
        Post.findByIdAndUpdate(
            {_id: req.body.post }, 
            {$inc: {likes: -1}}
        )
    ])
    res.sendStatus(200)
})

exports.post_detail_get = asyncHandler(async (req, res, next) => {
    const postDetail = await Post.findById(req.params.id).exec();
    if(postDetail === null) {
        const err = new Error("Post not found");
        err.status = 404;
        return next(err);
    }
    res.json(postDetail)
});
exports.post_detail_post = asyncHandler(async (req, res, next) => {
    res.send('Posts Delete Post')
});
