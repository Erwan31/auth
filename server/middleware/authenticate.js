const { User } = require('../models/user');


// Custom MW
let authenticate = (req, res, next) => {
    let token = req.cookies.auth;

    User.findByToken(token, (err, user) =>{
        if(err) return res.status(400).json({
            message: 'Bad token'
        });
        if(!user) return res.status(401).send('bad');

        // Access req to get informations (local DB kinda)
        req.user = user;
        req.token = token;

        next();
    });
}

module.exports = { authenticate };