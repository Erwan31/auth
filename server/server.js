const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const bcrypt = require('bcrypt');


mongoose.connect('mongodb://localhost:27017/AuthApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.set('useCreateIndex', true);

// MW
app.use(bodyParser.json());

// MODEL
const {User} = require('./models/user'); 


// Routes
app.post('/api/user', (req, res) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password,
    });

    user.save( (err, doc) => {
        if(err) res.status(400).send(err);
        res.status(200).send(doc);
    })
})


// 1 - FInd if user exists -> 2 - Compare String PW with Hash one -> 3 - Send Response
app.post('/api/user/login', (req, res) => {
    User.findOne({'email': req.body.email}, (err, user) => {
        
        // 1
        if(!user) res.json({message: "User not found"});

        // 2
        user.comparePassword(req.body.password, function( err, isMatch){
            if(err) throw err;
            if(!isMatch) return res.status(400).json({message: 'Wrong PW'});
            
            user.generateToken((err, user) =>{
                if(err) return res.status(400).send(err);
                res.cookie('auth', user.token).send(user.token).json({message: 'Good PW'});
            })
            
            res.status(200).send(isMatch);
        });

    })
})



const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Started @ port ${port}`);
})