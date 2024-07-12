const jwt = require('jsonwebtoken');

const { renderDataInternalErrorMessage } = require("../../status/messages");

/**
 * Set req.user if a user is authenticated and if it's not proceed anyways
 */
function optionalAuthenticateRest(req, res, next) {
	try {
		// Get jwt token
		const jwtToken = req.cookies.token;
		if(!jwtToken) {
			next();
		}
		
		// Expand
		const user = jwt.decode(jwtToken);
		req.user = user;
		
		next();
	} catch(err) {
		console.error(err);
		return res.send({
			...renderDataInternalErrorMessage
		});
	}
}

module.exports = optionalAuthenticateRest;
