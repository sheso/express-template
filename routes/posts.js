const express = require('express');
const User = require('../models/user');
const Post = require('../models/post');
const { authMiddleware } = require('../middlewares');
const { formatPost, isAuthor } = require('../helpers');

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

router.get('/:id/like', authMiddleware, async (req, res) => {
	const post = await Post.findById(req.params.id);
	const userLikeIndex = post.likes.indexOf(req.session.user.id);
	if (userLikeIndex === -1) {
		post.likes.push(req.session.user.id);
		await post.save();
		return res.json({likesCount: post.likes.length, userLiked: true});
	} else {
		post.likes.splice(userLikeIndex, 1);
		await post.save();
		return res.json({likesCount: post.likes.length, userLiked: true});
	}
});

router.post('/:id/comment', authMiddleware, async (req, res) => {
	const { body } = req.body;
	const comment = new Post({
    body: body,
    author: req.session.user.id,
		parent: req.params.id,
	});
	await comment.save();
	res.redirect(`/posts/${req.params.id}`);
});

router
.route('/edit/:id')
.get(async (req, res) => {
	let post = await Post.findById(req.params.id);
	if (isAuthor(req.session, post.author.toString())) {
		post = JSON.parse(JSON.stringify(post));
		return res.render('addPostForm', { ...post, formTitle: 'Редактировать пост', action: `/posts/edit/${req.params.id}`, isEdit: true});
	} 
	res.redirect(`/posts/${req.params.id}`);
})
.post(async (req, res) => {
	const post = await Post.findById(req.params.id);
	if (isAuthor(req.session, post.author.toString())) {
		await Post.findOneAndUpdate(
			{_id: req.params.id}, 
			{title: req.body.title, body: req.body.body}
			);
		}	
		res.redirect('/');
	});
	
router.get('/delete/:id', async (req, res) => {
	const post = await Post.findById(req.params.id);
	if (isAuthor(req.session, post.author.toString())) {
		await Post.findByIdAndDelete(req.params.id);
	}
	return res.redirect('/');
});

router.get('/comment/:id/delete', authMiddleware, async (req, res) => {
	const post = await Post.findById(req.params.id);
	if (isAuthor(req.session, post.author.toString())) {
		await Post.findByIdAndDelete(req.params.id);
	}
	return res.redirect(`/posts/${post.parent}`);
});

router.get('/:id', async (req, res) => {
	const post = await Post.findById(req.params.id).populate('author');
	const formattedPost = await formatPost(post, req.session);
	const comments = await Post.find({parent: req.params.id}).populate('author');
	console.log(comments);
	res.render('post', { ...formattedPost, comments, action: `/posts/${req.params.id}/comment` });
});

module.exports = router;
