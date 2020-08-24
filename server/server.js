const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const config = require('./config').get(process.env.NODE_ENV);

mongoose.connect( config.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.set('useCreateIndex', true);

// MW
app.use(bodyParser.json());
app.use(cookieParser());
const { authenticate } = require('./middleware/authenticate')

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
                console.log('cookie here');
                res.cookie('auth', user.token).send('ok');
            })
            
            //res.status(200).send(isMatch);
        });

    })
});

app.get('/api/books', authenticate, (req, res) =>{

    res.send(req.user);
})

app.get('/api/magazines', authenticate, (req, res) =>{

    res.send(req.user);

})

app.get('/api/user/logout',authenticate, (req, res) => {
    req.user.deleteToken(req.token, (err, user) =>{
        if(err) return res.status(400).send(err);
        res.status(200).send('ok');
    })
})


const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Started @ port ${port}`);
})