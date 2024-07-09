const { body } = require("express-validator");
const { SHORT_STRING_LENGTH, MIN_PASSWORD_LENGTH } = require("./constants");

const VALIDATE_PASSWORDS = [
	body(
		"password",
		`Password must be between ${MIN_PASSWORD_LENGTH} and ${SHORT_STRING_LENGTH}`
	).isLength({
		min: MIN_PASSWORD_LENGTH,
		max: SHORT_STRING_LENGTH
	}),
	body(
		"confirmPassword",
		`Confirm password must be between ${MIN_PASSWORD_LENGTH} and ${SHORT_STRING_LENGTH}`
	).isLength({
		min: MIN_PASSWORD_LENGTH,
		max: SHORT_STRING_LENGTH
	}),
];

module.exports = VALIDATE_PASSWORDS;
