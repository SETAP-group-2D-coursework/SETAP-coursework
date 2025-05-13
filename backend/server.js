const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const path = require('path');


app.use(cors({ 
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(session({ 
    secret: 'secret_key', 
    resave: false, 
    saveUninitialized: false ,
    cookie: { secure: process.env.NODE_ENV === 'production' }
})); // Middleware for session 
app.use(express.static(path.join(__dirname, '../frontend')));

const userRoutes = require('./routes/userRoutes');
const roomRoutes = require('./routes/roomRoutes');
app.use('/api', userRoutes);
app.use('/api', roomRoutes);

if (require.main === module) {
    app.listen(3000, () => console.log('app listening on port 3000'));
}


module.exports = app;