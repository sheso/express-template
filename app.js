require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const hbs = require('hbs');
const logger = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');

const app = express();
mongoose.connect(process.env.DB_URI, { useUnifiedTopology: true, useNewUrlParser: true }, () => {
    console.log('Mongo is up, my lord');
});

// Setting up hbs
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// Setting cookie name
app.set('session cookie name', 'sid');

// Setting up middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(session({
    name: app.get('session cookie name'),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1e10 }
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

app.listen(process.env.PORT, () => {
    console.log('Server is alive');
});
