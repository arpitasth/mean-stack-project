const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/config');

/**
 *  Schema For Users
 */
const UserSchema = new mongoose.Schema({
    name: {
        type:String,
        require: [true, 'Please Enter a name']
    },
    email: {
        type: String,
        required: [true, 'Please Enter a email'],
        unique: true,
        match: [
            /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
            'Please enter a valid email'
        ]
    },
    role: {
        type: String,
        enum: [
            'user',
            'admin'
        ],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please Add a password'],
        min: 6,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, {
    toObject: { virtuals: true },
    toJson: { virtuals: true }
});

// Encrypt Password using Bcrypt
UserSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT & return
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, config.config.JWT_SECRET_KEY, {
        expiresIn: config.config.JWT_EXPIRE
    })
}

// Match User Entered Password
UserSchema.methods.matchPassword = async function(enteredPassword) {
    const values = await bcrypt.compare(enteredPassword, this.password);
    return values;
}


module.exports = mongoose.model('User', UserSchema);
