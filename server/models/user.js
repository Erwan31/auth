const mongoose = require('mongoose');
const brcrypt = require('bcrypt');
const SALT_I = 10;
const jwt = require('jsonwebtoken');
const config = require('../config').get(process.env.NODE_ENV);

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: 1,
    },
    password: {
        type: String,
        minlength: 8,
        required: true,
    },
    token:{
        type: String,
        // required: true,
    }
});

// Intercept data of the schema before saving on DB
userSchema.pre('save', function(next) {
    var user = this;

    if( user.isModified('password')){
        brcrypt.genSalt(SALT_I, function(err, salt){
            if(err) return next(err);

            brcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err);
                user.password = hash;
                next();
            })
        })
    }
    else{
        next();
    }
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {

        var user = this;
    
        // 2
        brcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            if(err) return cb(err);
            cb(null, isMatch);
        });
}

/*
userSchema.methods.generateToken = function(cb){
    var user = this;
    let token = jwt.sign(user._id.toHexString(), 'supersecret');

    user.token = token;
    user.save( function(err, user){
        if(err) return cb(err);
        cb(null,user);
    })
}
*/
userSchema.methods.generateToken = function(cb){
    var user = this;
    let token = jwt.sign(user._id.toHexString(), config.SECRET);

    user.token = token;
    user.save(function(err,user){
        if(err) return cb(err);
        cb(null,user);
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;
    jwt.verify(token, config.SECRET, (err,decode) =>{
        user.findOne({'_id': decode, 'token': token}, (err, user) =>{
            if(err) return cb(err);
            cb(null, user);
        })
    })
}

/*
userSchema.methods.deleteToken = function(token, cb){
    var user = this;

    user.update({$unset: {token: 1}}, (err, user) =>{
        if(err) return cb(err);
        cb(null, user);
    });
}
*/

userSchema.methods.deleteToken = function(token,cb){
    var user = this;

    user.updateOne({$unset: { token: 1 }},(err,user)=>{
        if(err) return cb(err);
        cb(null,user);
    })
}



const User = mongoose.model('User', userSchema);
module.exports = { User };