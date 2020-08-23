const bcrypt = require('bcrypt');
const {MD5} = require('crypto-js');
const jwt = require('jsonwebtoken');


bcrypt.genSalt(10, function(err, salt){
    if(err) return next(err);
    bcrypt.hash('12341234', salt, function(err, hash){
        console.log(hash);
    })
});

/*
const secret = "supersecret";
const secretSalt = "djfjdfjhsguddhddjjfdf..-bf+12345rdhfhs/&/(&&%&%uklkk;dcdcªçeK";

const user = {
    id: 12,
    token: MD5('password').toString() + secretSalt;
}
*/

let id = '100';
const secret = "supersecret";

const token = jwt.sign(id, secret);
const decodedToken = jwt.verify(token, secret);

console.log(token);
console.log(decodedToken);