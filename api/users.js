const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


router.post('/register', async (req, res) => {
    const {
        name,
        email,
        password
    } = req.body

    userFound = await User.findOne({
        email
    })

    if (userFound) return res.status(400).json({
        email: "Email exists"
    })

    const newUser = new User({
        name,
        email,
        password
    })

    newUser.password = await generateHash(password)

    newUser.save()
        .then(user => res.json(user))
        .catch(err => console.log(err))

})

router.post('/login', async (req, res) => {
    const {
        email,
        password
    } = req.body
    const userFound = await User.findOne({
        email
    })

    if (!userFound) return res.status(400).json({
        email: "User not found"
    })

    const isMatch = await bcrypt.compare(password, userFound.password)
    if (!isMatch) return res.status(400).json({
        password: "Password is not corret"
    })

    res.json(await jwtSign(userFound))
})

const generateHash = password => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => resolve(hash))
        })
    })
}

const jwtSign = user => {
    require('dotenv').config()

    const payload = {
        id: user.id,
        name: user.name
    }
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.JWTSECRET, {
            expiresIn: 3600
        }, (err, token) => {
            resolve({
                success: true,
                token: `Bearer ${token}`
            })
        })
    })
}


module.exports = router