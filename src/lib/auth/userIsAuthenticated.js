
/**
 * Check if a user is authenticated
 */
function userIsAuthenticated(req, res, next) {
	const isAuthenticated = req.isAuthenticated();
	console.log(`Is authenticated: `, isAuthenticated);
	console.log(`User: `, req.user);
	if(isAuthenticated) {
		return next();
	}
	
	return res.redirect("/auth/login");
}

module.exports = userIsAuthenticated;
