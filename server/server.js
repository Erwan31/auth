const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();


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





const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Started @ port ${port}`);
})