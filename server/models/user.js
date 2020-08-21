const mongoose = require('mongoose');

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

const User = mongoose.model('User', userSchema);
module.export = { User };