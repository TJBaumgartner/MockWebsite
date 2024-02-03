const User = require('../models/user')
const asyncHandler = require("express-async-handler");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Token = require('../models/refreshToken')

exports.sign_up = asyncHandler(async (req,res) => {
    const userExists = await User.findOne({username:req.body.username}).exec()
    if(userExists){
        return res.status(400).send('User already exists')
    }
    const securePass = await bcrypt.hash(req.body.password)
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: securePass,
        bio: "",
    })
    await user.save()
    return res.status(200).send('New User created!')
})
