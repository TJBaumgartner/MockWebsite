const User = require('../models/user')
const asyncHandler = require("express-async-handler");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Token = require('../models/token')


const { faker } = require('@faker-js/faker');
const Post = require('../models/posts')

exports.create_fake = asyncHandler(async (req,res) => {
    const randomUsername = faker.internet.userName();
    const randomPassword = faker.internet.password();
    const randomEmail = faker.internet.email();

    const userExists = await User.findOne({$or: [{username: randomUsername}, {email: randomEmail}]}).exec()
    console.log(userExists)
    if(userExists){
        return res.status(400).send('User already exists')
    }
    const securePass = await bcrypt.hash(randomPassword, 10);
    const user = new User({
        username: randomUsername,
        email: randomEmail,
        password: securePass,
    })
    await user.save()
    return res.status(200).send('New User created!')
})

exports.create_fake_post = asyncHandler(async (req,res) => {
    const randomDate = faker.date.past({ years: 2 })
    const randomLikes = faker.number.int({ max: 1000 })
    const randomWords = faker.lorem.words({ min: 5, max: 20 })

    const user = await User.findOne({username: 'Leilani_Okuneva66'});
    if(user == null){
        res.status(400).json('User does not exist')
    }
    const post = new Post({
        message: randomWords,
        likes: randomLikes,
        createdAt: randomDate,
        user: user._id
    })
    await post.save()
    res.sendStatus(200)
})







exports.index = asyncHandler(async (req,res) => {
    res.sendStatus(200)
})

exports.user_get = asyncHandler(async (req,res) => {
    const user = await User.findOne({_id: req.body.id})
    if(user == null){
        return res.status(401).json("User doesn't exist")
    }
    res.json(user)
})

exports.user_edit = asyncHandler(async (req,res) => {
    const user = await User.findOne({_id: req.body.id})
    if(user == null){
        return res.send(401).json('No users found')
    }
    const updatedUser = new User({
        username: user.username,
        email: user.email,
        password: user.password,
        bio: req.body.bio,
        followers: user.followers,
        following: user.following,
        likes: user.likes,
        user: user.user,
        about: req.body.about,
        _id: user._id
    })
    await User.findOneAndUpdate({_id: req.body.id}, updatedUser)
    res.json(updatedUser)
})


exports.discoverList = asyncHandler(async (req,res) => {
    const allUsers = await User.find().where({'followers': {"$ne": req.body.id}}).sort({followers: -1}).exec()
    res.status(200).json(allUsers).end()
})
exports.followerList = asyncHandler(async (req,res) => {
    const allUsers = await User.findOne({_id: req.body.id}).populate('followers').sort({followers: -1}).exec()
    res.status(200).json(allUsers).end()
})
exports.followingList = asyncHandler(async (req,res) => {
    const allUsers = await User.findOne({_id: req.body.id}).populate('following').populate('followers').sort({followers: -1}).exec()
    res.status(200).json(allUsers).end()
})
exports.userLikes = asyncHandler(async (req,res) => {
    const allLikes = await User.find({_id: req.body.id})
    if(allLikes == null){
        return res.sendStatus(400)
    }
    res.status(200).json(allLikes).end()
})
exports.liked_posts_list = asyncHandler(async (req,res) => {
    const userLikes = await User.find({_id: req.params.id}).populate({path: 'likes', populate : {path: 'user'}})
    if(userLikes == null){
        return res.sendStatus(400)
    }
    res.status(200).json(userLikes).end()
})
exports.follow = asyncHandler(async (req,res) => {
    const [currentUser, userToFollow] = await Promise.all([
        User.findOne({_id: req.body.id}),
        User.findOne({_id: req.body.user}),
    ])
    if(currentUser == null || userToFollow == null){
        return res.status(401)
    }
    if(currentUser.following.includes(userToFollow)){
        return res.status(401).json('Already following')
    }
    await Promise.all([
        User.findByIdAndUpdate(
            {_id: req.body.user }, 
            { $push: { followers: req.body.id}
        }),
        User.findByIdAndUpdate(
            {_id: req.body.id }, 
            { $push: { following: req.body.user}
        })
    ])

    res.sendStatus(200)
})
exports.posts_list = asyncHandler(async (req, res, next) => {
    const posts = await Post.find({user: req.params.id})
    if(posts == null){
        return res.sendStatus(401)
    }
    res.json(posts)
});

exports.unfollow = asyncHandler(async (req,res) => {
    const [currentUser, userToUnfollow] = await Promise.all([
        User.findOne({_id: req.body.id}),
        User.findOne({_id: req.body.user}),
    ])
    if(currentUser == null || userToUnfollow == null){
        return res.status(401)
    }
    await Promise.all([
        User.findByIdAndUpdate(
            {_id: req.body.user }, 
            { $pull: { followers: req.body.id}
        }),
        User.findByIdAndUpdate(
            {_id: req.body.id }, 
            { $pull: { following: req.body.user}
        })
    ])
    res.sendStatus(200)
})
exports.sign_up = asyncHandler(async (req,res) => {
    const userExists = await User.findOne({$or: [{username:req.body.username}, {email: req.body.email}]}).exec()
    console.log(userExists)
    if(userExists){
        return res.status(400).send('User already exists')
    }
    const securePass = await bcrypt.hash(req.body.password, 10);

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: securePass,
    })
    await user.save()
    return res.status(200).send('New User created!')
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn: '20s'})
}

exports.login = asyncHandler(async (req,res) => {
    const user = await User.findOne({$or: [{username:req.body.username}, {email: req.body.username}]}).exec()
    if(user == null){
        return res.status(400).send('User does not exist')
    }
    try{
        const passwordCheck = await bcrypt.compare(req.body.password, user.password)
        if(passwordCheck){
            const accessToken = generateAccessToken(user.toJSON())
            const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_TOKEN)
            const token = new Token({token: refreshToken})
            await token.save()
            res.json({accessToken: accessToken, refreshToken: refreshToken, name: user.username, userId: user._id})
        } else {
            return res.status(403).send('Incorrect Password')
        }
    } catch {
        res.status(500).send('No user');
    }
})

exports.logout = asyncHandler(async (req,res) => {
    const token = req.body.token
    if(token == null) return res.sendStatus(404);
    const clearToken = await Token.findOne({token: token});
    if(!clearToken){
        return res.sendStatus(403)
    }
    await Token.findOneAndDelete({token: req.body.token});
    return res.sendStatus(200);
})

exports.refresh =  asyncHandler(async (req, res) => {
    const refreshToken = req.body.token
    
    if(refreshToken == null) {
        return res.sendStatus(401)
    }

    const token = await Token.findOne({token: refreshToken})

    if(!token){
        return res.sendStatus(403)
    }

    try{
        const user = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
        const newAccessToken = generateAccessToken({user: user.username})
        res.json({accessToken: newAccessToken})

    } catch(err){
        res.sendStatus(401)
    }
})