const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const joinRoomRoutes = require('./routes/joinRoomRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const db = require('./configs/db_config')
const port = 3000;

app.use(express.json());

const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/loginpage')));

const cors = require('cors');
app.use(cors());

// Middleware for session 
app.use(session({ 
    secret: process.env.SESSION_SECRET || 'secret_key', 
    resave: false, 
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));


app.get('/login', (req, res) => {
    res.send({
        username : req.body.username,
        password : req.body.password
    })
})

app.post('/login', (req, res) => {

    const {username, email, password} = req.body;

    console.log('req.body:', req.body)
    if(!password) {
        return res.status(400).send({message: "Password is required!"});
    } 
    if(!username && !email) {
        return res.status(400).send({
            message:"A username/email is required."
        });
    } 
    db.getUserByUsernameOrEmail(req, res);
    
});

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)


// Register routes
app.use('/api/rooms', authMiddleware, joinRoomRoutes);

app.listen(port, () => console.log(`app listening on port ${port}`));