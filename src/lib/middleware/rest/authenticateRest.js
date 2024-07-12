const jwt = require('jsonwebtoken');

const { renderDataInternalErrorMessage } = require("../../status/messages");

/**
 * Authenticate user on the REST API
 */
function authenticateRest(req, res, next) {
	try {
		// Get jwt token
		const jwtToken = req.cookies.token;
		if(!jwtToken) {
			return res.send({
				messages: [{
					message: "You are not authenticated",
					type: "error"
				}]
			});
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

module.exports = authenticateRest;
