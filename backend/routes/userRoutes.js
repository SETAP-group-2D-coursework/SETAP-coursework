const express = require('express');
const router = express.Router();
const {getUsers,getUserById, createUser, updateUser, deleteUser, getUserByUsernameOrEmail} = require('../models/userModel');

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/register', createUser);
router.post('/login', getUserByUsernameOrEmail);

module.exports = router;