const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: String,
    body: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
