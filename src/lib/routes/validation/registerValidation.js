const { body } = require("express-validator");
const { SHORT_STRING_LENGTH } = require("./constants");

// Express validation things
const REGISTER_VALIDATION = [
	body("email", "The email can't be empty").escape().notEmpty(),
	body("email", "The email is too long").isLength({ max: SHORT_STRING_LENGTH }),
	body("email", "The email is wrong").isEmail(),
	body("name", "The name is too long").escape().isLength({ max: SHORT_STRING_LENGTH }),
	body("password", "Password is required, otherwise everyone would acces your account").notEmpty(),
	body("password", "Password is too long").isLength({ max: SHORT_STRING_LENGTH }),
	// No need to check length if we're comparing them anyways
	body("confirmPassword", "Confirm password is required").notEmpty(),
];

module.exports = REGISTER_VALIDATION;
