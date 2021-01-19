const User = require('./models/user');

const failAuth = res => {
	res.status(401).end();
};

const serializeUser = user => ({
	id: user._id,
	login: user.login,
	name: user.name,
});

const formatDate = date => {
	const fDate = new Date(date);
	const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
	const formattedDate = `${fDate.getUTCDate()} ${months[fDate.getUTCMonth()]} ${fDate.getUTCFullYear()}`;
	return formattedDate;
}

// This function is async!
const formatPost = async (post, session) => {
	const fPost = JSON.parse(JSON.stringify(post));
	fPost.isAuthor = isAuthor(session, fPost.author._id);
	fPost.createdAt = formatDate(fPost.createdAt);
	fPost.likesCount = fPost.likes.length;
	return fPost;
}

const isAuthor = (session, authorId) => {
	return session?.user?.id === authorId; 
};

module.exports = { failAuth, serializeUser, formatPost, isAuthor };
