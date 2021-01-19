const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Post = require('../models/post');

const { authMiddleware } = require('../middlewares');
const { failAuth, serializeUser, formatPost } = require('../helpers');

const router = express.Router();

router.get('/', async (req, res) => {
	const rawPosts = await Post.find().populate('author');
	const posts = await Promise.all(rawPosts.map(post => formatPost(post, req.session)));
	console.log(posts);
  res.render('index', { posts, action: '/posts/new', formTitle: 'Добавить пост'});
});

router.
    route('/login')
    .get((req, res) => {
        res.render('login');
    }).post(async (req, res) => {
        const { login, password } = req.body;
        try {
            const user = await User.findOne({ login });
            if (!user) {
                return failAuth(res);
            }
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return failAuth(res);
            }
						req.session.user = serializeUser(user);
        } catch (error) {
            console.error(error);
            return failAuth(res);
        }
        return res.end();
    });

router.
    route('/signup')
    .get((req, res) => {
        res.render('signup');
    }).post(async (req, res) => {
        const { name, login, password } = req.body;
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const user = new User({ name, login, password: hashedPassword });
            await user.save();
            req.session.user = serializeUser(user);
        } catch (error) {
            console.error(error);
            return failAuth(res);
        }
        return res.end();
    });

router.get('/logout', (req, res, next) => {
    req.session.destroy(err => {
        if (err) return next(err);
        res.clearCookie(req.app.get('session cookie name'));
        return res.redirect('/');
    });
});

module.exports = router;
