const mongoose = require('mongoose');
const brcrypt = require('bcrypt');
const SALT_I = 10;


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

const User = mongoose.model('User', userSchema);
module.exports = { User };