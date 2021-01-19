const express = require('express');
const User = require('../models/user');
const Post = require('../models/post');
const { authMiddleware } = require('../middlewares');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hi, I am Posts');
});

router
	.route('/new')
		.get(authMiddleware, (req, res) => {
			res.render('form');
		})
		.post(authMiddleware, async (req, res) => {
			const { title, body } = req.body;
			const post = new Post({title, body, author: req.session.user.id});
			await post.save();
			res.redirect('/');
		});

module.exports = router;
