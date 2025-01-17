const { body } = require("express-validator");
const { STRING_LENGTH, DESCRIPTION_LENGTH, URL_LENGTH } = require("./constants");

const CREATE_GROUP_VALIDATION = [
	body("name", "The name can't be empty").escape().notEmpty(),
	body("name", "Name must be shorter than 256 characters")
		.isLength({ max: STRING_LENGTH }),
	// Cannot escape this one maybe with ejs '<%='
	body("description", "Description can't be empty")
		// .escape()
		.notEmpty(),
	body("description", "Description must be shorter than 8192 characters")
		.isLength({ max: DESCRIPTION_LENGTH }),
	body("category", "Category can't be empty").escape().notEmpty(),
	// Cannot escape this one maybe with ejs '<%='
	// body("url", "Bad url").escape(),
	body("url", "Url can't be longer than 1024 characters").isLength({ max: URL_LENGTH }),
];

module.exports = CREATE_GROUP_VALIDATION;
