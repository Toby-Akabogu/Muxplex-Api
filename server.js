const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/muxplex', { useNewUrlParser: true}, (err) => {
    if (!err){
        console.log('Mongo DB connected successfully')
    }
    else{
        console.log('There was an error in the database connection ' + err);
    }
});

const database = {
    chickens: [
        {
            name:'Jeffrey',
            email: 'jeffreyu@gmail.com'
        }
    ]
}

//Creates schema/pattern for contact page
const contactSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        trim: true
    }
});

const Contact = mongoose.model('Contact', contactSchema);

//Creates schema/pattern for Users
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    DOB: {
        type: Date
    },
    joined: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
    res.send(database.chickens);
})

app.post('/contact', (req, res) => {
    const newContact = new Contact({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        message: req.body.message
    })
    newContact.save(function(err){
        if(err) res.status(400).json("Error making contact");
        else{
            res.json('Contact made');
        }
    })
    
})

app.post('/register', (req, res) => {
    const newUser = User({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dob: req.body.DOB,
        joined: req.body.Date
    })
    newUser.save(function(err){
        if(err){console.log(err);}
        else{
            console.log('User created');
        }
    })
    res.json(newUser);
})

app.post("/login", (req, res) => {
    const hash = bcrypt.hashSync(password);
    if(req.body.email === database.users[1].email && req.body.password === database.users[1].password) {
        res.json("success");
    }
    else{
        res.status(400).json("error logging in");
    }
})

app.post('/signup', (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    database.users.push({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        id: '12345',
        joined: new Date()
    })
    res.json(database.users[database.users.length-1]);
})

app.post('/contact', (req, res) => {
    const { firstName, lastName, email, pNumber, message } = req.body;
    database.users.push({
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: pNumber,
        mes: message,
        joined: new Date()        
    })
    res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id){
            found = true;
           return res.json(user);
        }
    })
    if(!found){
        res.status(400).json("User not found");
    }
})

app.listen(3000, ()=> {
    console.log("app is running on port 3000");
})