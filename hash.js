const bcrypt = require('bcrypt');

bcrypt.genSalt(10, function(err, salt){
    if(err) return next(err);
    bcrypt.hash('12341234', salt, function(err, hash){
        console.log(hash);
    })
});