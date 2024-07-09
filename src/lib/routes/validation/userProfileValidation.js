const { body } = require("express-validator");
const { SHORT_STRING_LENGTH, DESCRIPTION_LENGTH } = require("./constants");

// Express validation things
const USER_PROFILE_VALIDATION = [
	body("email", "The email can't be empty").escape().notEmpty(),
	body("email", "The email is too long").isLength({ max: SHORT_STRING_LENGTH }),
	body("email", "The email is wrong").isEmail(),
	body("name", "The name is too long").escape().isLength({ max: SHORT_STRING_LENGTH }),
	body("description", "Description is too long").isLength({ max: DESCRIPTION_LENGTH }),
];

module.exports = USER_PROFILE_VALIDATION;
