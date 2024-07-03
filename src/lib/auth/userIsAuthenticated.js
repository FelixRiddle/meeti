
/**
 * Check if a user is authenticated
 */
function userIsAuthenticated(req, res, next) {
	const isAuthenticated = req.isAuthenticated();
	if(isAuthenticated) {
		return next();
	}
	
	return res.redirect("/auth/login");
}

module.exports = userIsAuthenticated;
