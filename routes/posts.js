const express = require('express');
const User = require('../models/user');
const Post = require('../models/post');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hi, I am Posts');
});

router.post('/new', (req, res) => {
	const { title, body } = req.body;
	const post = new Post({title, body, author: 'Sonya'});
	
});

module.exports = router;
