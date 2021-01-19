const express = require('express');
const User = require('../models/user');
const Post = require('../models/post');
const { authMiddleware } = require('../middlewares');
const { formatPost } = require('../helpers');

const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/');
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

router.get('/:id', async (req, res) => {
	const post = await Post.findById(req.params.id).populate('author');
	const formattedPost = await formatPost(post, req.session);
	res.render('post', formattedPost);
});

router
	.route('/edit/:id')
		.get(async (req, res) => {
			let post = await Post.findById(req.params.id);
			post = JSON.parse(JSON.stringify(post));
			console.log(post);
			res.render('addPostForm', { ...post, formTitle: 'Редактировать пост', action: `/posts/edit/${req.params.id}`, isEdit: true});
		})
		.post(async (req, res) => {
			await Post.findOneAndUpdate(
				{_id: req.params.id}, 
				{title: req.body.title, body: req.body.body}
			);
			res.redirect('/');
		});

router.get('/delete/:id', (req, res) => {
	Post.findByIdAndDelete(req.params.id);
	res.redirect('/');
});
		
module.exports = router;
