const express = require('express');
const router = express.Router();
const {getUsers,getUserById, createUser, updateUser, deleteUser, getUserByUsernameOrEmail} = require('../models/userModel');

router.get('/users', getUsers);
router.get('/users/:id', (req,res) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)) {
        return res.status(400).json({ message: 'User not found'});
    }
    getUserById({ params: { id } }, res);
});
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/register', createUser);
router.post('/login', getUserByUsernameOrEmail);

module.exports = router;