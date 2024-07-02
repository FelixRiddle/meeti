const jwt = require("jsonwebtoken");

/**
 * Generate json web token
 */
function generateJwtToken(data) {
	// Authenticate user
	const secretKey = process.env.SECRET_KEY;
	const token = jwt.sign(
		data,
		secretKey,
		{
			expiresIn: "7d"
		}
	);
	
	return token;
}

module.exports = generateJwtToken;
