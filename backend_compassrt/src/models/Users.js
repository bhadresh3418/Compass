const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var env = require('../../config/env');

const Schema = mongoose.Schema;

//creating schema with specified fields
const UserSchema = new Schema({
    email: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    bio: String,
    image: String,
    hash: String,
    salt: String
}, {
    timestamps: true,
    versionKey: false
});

// Create a method for setting User passwords

UserSchema.methods.setPassword = function (password)
{
    delete this._id;
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

// Create a method for emitting password from data
UserSchema.methods.emitPassword = function ()
{
    delete this._doc.salt;
    delete this._doc.hash;
};

// Create a method to validate passwords
UserSchema.methods.validPassword = function (password)
{
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};


// Create a method on the user model to generate a JWT
UserSchema.methods.generateJWT = function ()
{
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        id: this._id,
        email: this.email,
        exp: parseInt(exp.getTime() / 1000),
    }, env.JWT_SECRET);
};

// Create a method to get the JSON representation of a user for authentication.
UserSchema.methods.toAuthJSON = function ()
{
    return {
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email,
        token: this.generateJWT(),
        bio: this.bio,
        image: this.image
    };
};

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

module.exports = mongoose.model("Users", UserSchema);
