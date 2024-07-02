const bcrypt = require("bcrypt");

/**
 * Validate password
 */
function validatePassword(password, hashedPassword) {
	return bcrypt.compareSync(password, hashedPassword);
}

module.exports = validatePassword;
