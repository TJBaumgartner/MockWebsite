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
    const userArray = req.body
    const posts = await Post.find({
        $or:[{user: {$in:req.body.followData}}, {user: req.body.id}]})
        .populate("user")
        .sort({createdAt: -1})
    if(posts == null){
        return res.sendStatus(401)
    }
    res.status(200).json(posts)
});



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
