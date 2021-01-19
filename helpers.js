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
	console.log(formattedDate);
	return formattedDate;
}

const formatPost = async (post, session) => {
	const fPost = JSON.parse(JSON.stringify(post));
	fPost.isAuthor = session?.user?.id ? session.user.id === fPost.author : false;
	const author = await User.findById(fPost.author);
	fPost.author = author.name;
	fPost.createdAt = formatDate(fPost.createdAt);
	fPost.likesCount = fPost.likes.length;
	return fPost;
}

module.exports = { failAuth, serializeUser, formatPost };
