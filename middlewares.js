const authMiddleware = (req, res, next) => {
	if (!req.session.user) {
		return res.redirect('/login');
	}
	next();
}

const userLocalsAssign = (req, res, next) => {
	res.locals.username = req.session.user?.name;
	next();
}

module.exports = { authMiddleware, userLocalsAssign };
