const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user');

const router = express.Router();

const failAuth = res => {
    res.status(401).end();
};

const serializeUser = user => ({
    id: user._id,
    login: user.login,
});

router.get('/', (req, res) => {
    res.render('index', { posts: [] });
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
            const saltRounds = Number(process.env.SALT_ROUNDS ?? 8);
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
