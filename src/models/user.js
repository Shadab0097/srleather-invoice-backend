const mongoose = require('mongoose')
const validator = require('validator')
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({

    emailId: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('email is not valid')
            }
        }
    },
    password: {
        type: String,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("write a strong password")
            }
        }

    },

}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)