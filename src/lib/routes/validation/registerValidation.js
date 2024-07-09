const { body } = require("express-validator");
const { SHORT_STRING_LENGTH } = require("./constants");
const VALIDATE_PASSWORDS = require("./validatePassword");

// Express validation things
const REGISTER_VALIDATION = [
	body("email", "The email can't be empty").escape().notEmpty(),
	body("email", "The email is too long").isLength({ max: SHORT_STRING_LENGTH }),
	body("email", "The email is wrong").isEmail(),
	body("name", "The name is too long").escape().isLength({ max: SHORT_STRING_LENGTH }),
	...VALIDATE_PASSWORDS,
];

module.exports = REGISTER_VALIDATION;
