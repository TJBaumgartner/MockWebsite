const User = require('../models/user')
const asyncHandler = require("express-async-handler");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Token = require('../models/token')

exports.index = asyncHandler(async (req,res) => {
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
    console.log(user)
    await user.save()
    console.log('final')
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
            res.json({accessToken: accessToken, refreshToken: refreshToken, name: user.username, userId: user.id})
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