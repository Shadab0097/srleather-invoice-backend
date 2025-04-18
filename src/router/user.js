const express = require('express')
const User = require('../models/user')
// const { validateSignupData, passwordEncryption } = require('../utils/validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { userAuth } = require('../middlewares/userAuth')



const userRouter = express.Router()

userRouter.post('/api/signup', async (req, res, next) => {

    try {
        const userCount = await User.countDocuments()

        if (userCount > 0) {
            throw new Error('admin is already there')
        }
        next()
    } catch (err) {
        return res.status(400).send("ERROR" + err.message)
    }

}, async (req, res) => {

    try {
        const { emailId, password } = req.body

        const encryptPasswordHash = await bcrypt.hash(password, 10)
        // const passwordHash = await passwordEncryption(password, 10)
        console.log(encryptPasswordHash)

        const user = new User({

            emailId,
            password: encryptPasswordHash,
        })

        await user.save()
        res.json({ message: 'welcome Admin', data: user })
    } catch (err) {
        console.log(err)
        res.status(400).send('Error while signingUp' + err.message)
    }
})

userRouter.post('/api/login', async (req, res) => {
    try {
        const { emailId, password } = req.body
        const user = await User.findOne({ emailId: emailId })

        if (!user) {
            res.status(400).send('User not found')

        }


        const isPasswordValid = await bcrypt.compare(password, user.password)


        if (isPasswordValid) {
            // create a cookie

            const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })

            // send the cookie back to user
            res.cookie("token", token, {
                secure: true, // HTTPS only
                sameSite: 'None', // Cross-site cookies
                httpOnly: true, // Prevent XSS
                path: '/', // Accessible across all routes
                expires: new Date(Date.now() + 8 * 3600000) // Expires in 8 hours
            })


            res.json({ message: "user LoggedIn successfully", data: user })
        } else {
            throw new Error("invalid Credentials")
        }
    } catch (err) {
        res.status(400).send(err.message)
    }
})
userRouter.post('/api/logout', async (req, res) => {

    res.cookie('token', null, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        expires: new Date(0)
    })

    res.send('logout successfully')
})
userRouter.get("/api/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user
        res.send(user)

    } catch (err) {
        res.status(400).send("ERROR:" + err.message)
    }
})


module.exports = { userRouter }