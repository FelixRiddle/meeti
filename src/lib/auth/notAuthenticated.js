/**
 * Check if a user is not authenticated
 * 
 * Useful for these routes:
 * * Register
 * * Login
 */
function notAuthenticated(req, res, next) {
	const isAuthenticated = req.isAuthenticated();
	console.log(`Is authenticated: `, isAuthenticated);
	if(!isAuthenticated) {
		return next();
	}
	
	// Redirect to home
	return res.redirect("/");
}

module.exports = notAuthenticated;
